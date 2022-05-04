import { Logger } from '@ricdotnet/logger/dist';
import { Websocket } from '../Core/Decorators/WebsocketDecorator';
import { WebsocketChannel } from '../Core/Websockets/WebsocketChannel';
import { IConnection } from '../Interfaces/IWebsocketConnection';
import { RoomsService } from '../Services/RoomsService/RoomsService';
import { UserService } from '../Services/User/UserService';

interface IChatRoomPayload {
  type: string;
  metadata: {
    roomId: string;
    sender: number;
    message: string;
  };
}

@Websocket('rooms-chat-channel')
export class ChatRoomWebsocket extends WebsocketChannel {
  constructor(name: string) {
    super(name);
  }

  async broadcast(data: IChatRoomPayload) {
    const roomStatus = await this.resolveRoomStatus(data.metadata.roomId); // private or public
    const roomPermission = await this.resolveRoomPermission(data.metadata.roomId);

    if (roomPermission === 'admin') {
      return this.sendAdminRoomMessage(data);
    }

    if (roomStatus === 'public' && roomPermission === 'all') {
      return this.sendPublicRoomMessage(data);
    }

    if (roomStatus === 'private' && roomPermission === 'all') {
      const allowedUsers = await this.resolveRoomAllowedUsers(data.metadata.roomId);
      return this.sendPrivateRoomMessage(data, allowedUsers);
    }
  }

  private sendAdminRoomMessage(data: IChatRoomPayload) {
    this.connections().forEach(async (ws) => {
      if (ws.user !== data.metadata.sender) {
        const { role_id } = await UserService.isUserAdmin(ws.user);
        if (role_id === 1) {
          ws.connection.send(JSON.stringify(data));
        }
      }
    });
  }

  private sendPublicRoomMessage(data: IChatRoomPayload) {
    this.connections().forEach((ws) => {
      if (ws.user !== data.metadata.sender) {
        ws.connection.send(JSON.stringify(data));
      }
    });
  }

  private sendPrivateRoomMessage(data: IChatRoomPayload, privateUsers: number[]) {
    this.connections().forEach((ws) => {
      if (privateUsers.includes(ws.user) && ws.user !== data.metadata.sender) {
        ws.connection.send(JSON.stringify(data));
      }
    });
  }

  // if the room is an admin room we can only send to admin users in the connections list
  // if it is a public room send to everyone in the list
  // if it is a private room send to only users inside the room
  private async resolveRoomStatus(roomId: string): Promise<string> {
    let roomType = null;
    try {
      roomType = await RoomsService.resolveRoomStatus(roomId);
    } catch (error) {
      Logger.error('Could not resolve Room Status.');
      throw new Error('Could not resolve Room Status.');
    }

    return roomType;
  }

  private async resolveRoomPermission(roomId: string): Promise<string> {
    let roomPermission;
    try {
      roomPermission = await RoomsService.resolveRoomPermission(roomId);
    } catch (error) {
      Logger.error('Could not resolve Room Permission.');
      throw new Error('Could not resolve Room Permission.');
    }

    return roomPermission;
  }

  private async resolveRoomAllowedUsers(roomId: string): Promise<number[]> {
    let allowedUsers;
    try {
      allowedUsers = await RoomsService.resolveRoomAllowedUsers(roomId);
    } catch (error) {
      Logger.error(error);
    }

    return allowedUsers;
  }

  private connections(): IConnection[] {
    return this.liveConnections();
  }
}
