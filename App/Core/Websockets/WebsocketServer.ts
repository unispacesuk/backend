import 'reflect-metadata';
import { Server, WebSocket, WebSocketServer as WSServer } from 'ws';
import { UserService } from '../../Services/User/UserService';
import { Logger } from '@ricdotnet/logger/dist';
import { WebsocketChannelManager } from './WebsocketChannelManager';
import { IConnection } from '../../Interfaces/IWebsocketConnection';
import { NotificationsWebsocket } from '../../WebsocketChannels/Notifications.Websocket';
import { ChatRoomWebsocket } from '../../WebsocketChannels/ChatRoom.Websocket';

const channelClasses = [NotificationsWebsocket, ChatRoomWebsocket];

export class WebsocketServer {
  wss: Server;

  constructor() {
    this.wss = new WSServer({
      port: 10001,
      perMessageDeflate: false,
    });

    this.wss.on('listening', () => {
      Logger.info('Websockets listening on wss://ws.unispaces.uk');
    });

    for (const c of channelClasses) {
      const channel = Reflect.getMetadata('websocket-channel', c);
      WebsocketChannelManager.addChannel(new channel.target(channel.channelName));
    }

    this.wss.on('connection', (connection: WebSocket) => {
      connection.onclose = async () => {
        console.log('a connection broke...');
        const c = WebsocketChannelManager.getConnections().find((c) => (c.connection = connection));
        if (c) {
          await UserService.setUserStatus(c.user, false);
        }
        WebsocketChannelManager.getConnections().splice(
          WebsocketChannelManager.getConnections().findIndex((c) => c.connection === connection),
          1
        );
      };

      connection.on('message', async (rawData) => {
        const data = JSON.parse(rawData.toString());

        if (data && data.type === 'notification' && data.metadata.receiver) {
          const notificationsChannel = WebsocketChannelManager.getChannels().find(
            (c) => c.getName() === 'notifications-channel'
          );

          if (!notificationsChannel) return;

          notificationsChannel.broadcast(data);
        }

        if (data && data.type === 'room-message' && data.metadata.room_id) {
          const roomChannel = WebsocketChannelManager.getChannels().find(
            (c) => c.getName() === 'rooms-chat-channel'
          );

          if (!roomChannel) return;

          roomChannel.broadcast(data);
        }

        if (data && data.type === 'connection') {
          const newConnection: IConnection = {
            connection: connection,
            user: data.user,
            isAlive: true,
          };
          WebsocketChannelManager.getConnections().push(newConnection);

          const hasConnection = WebsocketChannelManager.getConnections().find(
            (c) => c.connection === connection
          );
          if (hasConnection) {
            WebsocketChannelManager.getConnections().splice(
              WebsocketChannelManager.getConnections().indexOf(hasConnection),
              1,
              newConnection
            );
          } else {
            WebsocketChannelManager.getConnections().push(newConnection);
          }

          await UserService.setUserStatus(newConnection.user, true); // set user online
        }

        if (data && data.type === 'pong' && data.user) {
          WebsocketChannelManager.getConnections().map((c) => {
            if (c.user === data.user && c.connection === connection) {
              c.isAlive = true;
            }
          });
        }
      });
    });

    // this.ping();
  }

  // send to single user
  sendMessage(user: number, type: string) {
    const connection = WebsocketChannelManager.getConnections().find((c) => c.user === user);
    if (connection && connection.user === user) {
      console.log('sending?');
      const msg = {
        event: 'notification',
        type: type,
        user: user,
      };

      connection.connection.send(JSON.stringify(msg));
    }
  }

  ping() {
    setInterval(() => {
      const clients: IConnection[] = WebsocketChannelManager.getConnections();
      clients.forEach(async (client) => {
        if (!client.isAlive) {
          WebsocketChannelManager.getConnections().splice(
            WebsocketChannelManager.getConnections().indexOf(client),
            1
          );
          await UserService.setUserStatus(client.user, false);
          return client.connection.close();
        }

        client.isAlive = false;
        client.connection.send(JSON.stringify({ type: 'ping', user: client.user }));
      });
    }, 15000);
  }
}
