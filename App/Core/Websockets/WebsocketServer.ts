import { Server, WebSocket, WebSocketServer as WSServer } from 'ws';
import { UserService } from '../../Services/User/UserService';

interface IConnection {
  connection: WebSocket;
  user: number;
  isAlive: boolean;
  channel?: string;
}

export class WebsocketServer {
  wss: Server;

  connections: IConnection[] = [];

  constructor() {
    this.wss = new WSServer({
      port: 3002,
      perMessageDeflate: false,
    });

    this.wss.on('listening', () => {
      console.log('Websockets listening on wss://ws.unispaces.test');
    });

    this.wss.on('connection', (connection: WebSocket) => {
      connection.on('message', async (rawData: any) => {
        const data = JSON.parse(rawData.toString());

        if (data.type === 'connect') {
          const newConnection = {
            connection: connection,
            user: data.user,
            isAlive: true,
          };

          const hasConnection = this.connections.filter((c) => c.user === data.user)[0];
          if (hasConnection) {
            this.connections.splice(this.connections.indexOf(hasConnection), 1, newConnection);
          } else {
            this.connections.push(newConnection);
          }

          await UserService.setUserStatus(newConnection.user, true); // set user online
        }

        if (data.type === 'pong' && data.user) {
          this.connections.map((c) => {
            if (c.user === data.user) {
              c.isAlive = true;
            }
          });
        }

        if (data.event === 'notification' && data.user) {
          this.sendMessage(data.user, data.type);
        }
      });
    });

    this.ping();
  }

  // send to single user
  sendMessage(user: number, type: string) {
    console.log(this.connections.length);
    const connection = this.connections.filter((c) => c.user === user)[0];
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
      this.connections.map(async (c) => {
        if (!c.isAlive) {
          this.connections.splice(this.connections.indexOf(c), 1);
          await UserService.setUserStatus(c.user, false); // set user offline
          return c.connection.terminate();
        }

        c.isAlive = false;
        c.connection.send(JSON.stringify({ type: 'ping', user: c.user }));
      });
    }, 10000);
  }
}
