import { Controller, Get, Post } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { RolesService } from '../../Services/Roles/RolesService';
import { request, respond } from '../../Core/Routing';
import { IBoard, IResponse } from '../../Interfaces';
import { BoardService } from '../../Services/Board/BoardService';

@Controller('/board', [AuthService.authenticate])
export class BoardController {
  @Post('/add', [RolesService.isUserAdmin])
  async addNewBoard(): Promise<IResponse> {
    const body: IBoard = request().body();
    if (!body || !body.title || !body.description) {
      return respond('fill all details', 400);
    }

    const board = await BoardService.createNewBoard();

    return respond({ board }, 200);
  }

  @Get('/get/all/:category')
  async getAllBoards(): Promise<IResponse> {
    const boards = await BoardService.getAllBoards();

    return respond({ boards }, 200);
  }
}
