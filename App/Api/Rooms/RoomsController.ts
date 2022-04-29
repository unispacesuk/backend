import { Controller, Get } from '../../Core/Decorators';
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

    let response: IRoomModel | unknown;
    try {
      response = await RoomsService.getRoomData();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    // @ts-ignore
    if (!response.users.includes(userId)) {
      return respond(
        { error: 'You have no permissions to access this room.', type: 'no-permission' },
        401
      );
    }

    return respond({ response }, 200);
  }
}
