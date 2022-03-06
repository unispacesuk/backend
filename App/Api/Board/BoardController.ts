import { Controller, Get, Post, Delete, Patch } from '../../Core/Decorators';
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

  @Patch('/:board', [AuthService.authenticate, RolesService.isUserAdmin])
  async editBoard() {
    let response;
    try {
      response = await BoardService.editBoard();
    } catch (e) {
      return respond({ error: e }, 400);
    }

    return respond({ response }, 200);
  }

  @Delete('/:board', [AuthService.authenticate, RolesService.isUserAdmin])
  async deleteBoard(): Promise<IResponse> {
    try {
      await BoardService.deleteBoard();
    } catch (e) {
      return respond({ error: e }, 400);
    }
    return respond({ m: 'deleted' }, 200);
  }
}
