import { Controller, Get, Post } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { RolesService } from '../../Services/Roles/RolesService';
import { param, request, respond } from '../../Core/Routing';
import { IBoard, IResponse } from '../../Interfaces';
import { BoardService } from '../../Services/Board/BoardService';
import { ThreadService } from '../../Services/Board/ThreadService';

@Controller('/board')
export class BoardController {
  @Post('/', [AuthService.authenticate, RolesService.isUserAdmin])
  async addNewBoard(): Promise<IResponse> {
    const body: IBoard = request().body();
    if (!body || !body.title || !body.description) {
      return respond({ m: 'fill all details' }, 400);
    }

    const board = await BoardService.createNewBoard();

    return respond({ board }, 200);
  }

  @Get('/c/:category')
  async getAllBoards(): Promise<IResponse> {
    const { category } = param();
    const boards = await BoardService.getAllBoards(category);

    return respond({ boards }, 200);
  }

  @Get('/:board')
  async getAllFromBoard(): Promise<IResponse> {
    const { board } = param();
    const threads = await ThreadService.getAllThreads(board);

    return respond({ threads }, 200);
  }
}
