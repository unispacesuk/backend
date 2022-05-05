import { Controller, Delete, Get, Patch, Post } from '../../Core/Decorators';
import { request, respond } from '../../Core/Routing';
import { IResponse } from '../../Interfaces';
import { RoomsService } from '../../Services/RoomsService/RoomsService';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { Logger } from '@ricdotnet/logger/dist';
import { IRoomModel } from '../../Models/RoomModel';

@Controller('/chat')
export class RoomsController {
  @Get('/rooms/all', [AuthService.authenticate])
  async getAllRooms(): Promise<IResponse> {
    let response: IRoomModel[] | unknown;
    try {
      // get the rooms
      response = await RoomsService.getAllRooms();

      // filter the rooms
      // @ts-ignore
      if (response && response.length) {
        response = await RoomsService.filterPrivateRooms(<IRoomModel[]>response);
      }
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  @Get('/room/:roomId', [AuthService.authenticate])
  async getSingleRoom(): Promise<IResponse> {
    const userId = request().data('userId');

    let response: IRoomModel | null = null;
    try {
      response = await RoomsService.getRoomData();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    if (
      response &&
      response.users &&
      !response.users.includes(<number>userId) &&
      userId !== response.userId
    ) {
      return respond(
        { error: 'You have no permissions to access this room.', type: 'no-permission' },
        401
      );
    }

    return respond({ response }, 200);
  }

  @Delete('/room/:roomId', [AuthService.authenticate])
  async deleteRoom(): Promise<IResponse> {
    try {
      await RoomsService.deleteRoom();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ message: 'Room Deleted.' }, 200);
  }

  @Patch('/room/:roomId', [AuthService.authenticate])
  async updateRoom(): Promise<IResponse> {
    try {
      await RoomsService.updateRoom();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ m: 'room updated' }, 200);
  }

  @Post('/room/new', [AuthService.authenticate])
  async createNewRoom(): Promise<IResponse> {
    let response: IRoomModel;
    try {
      response = await RoomsService.createRoom();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  // user to invite will be passed by query param
  @Post('/room/invite/:roomId', [AuthService.authenticate])
  async inviteUser() {
    try {
      const response = await RoomsService.inviteUser();
      if (response === 'duplicate-user') {
        return respond({ error: 'duplicate', message: 'User already invited.' }, 200);
      }
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ m: 'user invited' }, 200);
  }

  @Get('/room/users/:roomId', [AuthService.authenticate])
  async getRoomUsers(): Promise<IResponse> {
    let response;
    try {
      response = await RoomsService.getUsersList();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  @Delete('/room/remove/user/:roomId', [AuthService.authenticate])
  async removeUserFromRoom(): Promise<IResponse> {
    try {
      await RoomsService.removeUserFromRoom();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }
    return respond({ m: 'user removed' }, 200);
  }

  @Post('/room/message', [AuthService.authenticate])
  async postMessage(): Promise<IResponse> {
    try {
      await RoomsService.saveRoomMessage();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }
    return respond({ m: 'message sent' }, 200);
  }

  @Get('/room/messages/:roomId', [AuthService.authenticate])
  async getRoomMessages(): Promise<IResponse> {
    let response;
    try {
      response = await RoomsService.getRoomMessages();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }
}
