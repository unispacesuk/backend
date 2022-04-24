import { Controller, Delete, Get, Patch, Post } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { RolesService } from '../../Services/Roles/RolesService';
import { param, request, respond } from '../../Core/Routing';
import { IBoard, IResponse } from '../../Interfaces';
import { BoardService } from '../../Services/Board/BoardService';
import { ThreadService } from '../../Services/Board/ThreadService';
import { AdminMiddleware } from '../../Middlewares/AdminMiddleware';

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

    if (isNaN(category)) {
      return respond({ error: 'Invalid category id.' }, 400);
    }

    let boards;
    try {
      boards = await BoardService.getAllBoards(category);
    } catch (e) {
      console.log(e);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    return respond({ boards }, 200);
  }

  // TODO: error response if the board does not exist or it will break
  @Get('/:board')
  async getAllFromBoard(): Promise<IResponse> {
    const { board } = param();

    if (isNaN(board)) {
      return respond({ error: 'Invalid board id.' }, 400);
    }

    let threads;
    try {
      threads = await ThreadService.getAllThreads(board);
    } catch (e) {
      console.log(e);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    // we need a fallback method to get the titles when the threads array is empty or non-existent
    // this could replace the query later also
    if (threads === 0) {
      const boardData = await BoardService.getBoardData(board);

      // if boardData is 0 the board does not exist. error
      if (boardData === 0) {
        return respond({ error: 'The board does not exist.' }, 400);
      }

      return respond({ boardData }, 200);
    }

    return respond({ threads }, 200);
  }

  @Patch('/:board', [AuthService.authenticate, RolesService.isUserAdmin])
  async editBoard() {
    if (isNaN(param('board'))) {
      return respond({ error: 'Invalid board id.' }, 400);
    }

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
    if (isNaN(param('board'))) {
      return respond({ error: 'Invalid board id.' }, 400);
    }

    try {
      await BoardService.deleteBoard();
    } catch (e) {
      return respond({ error: e }, 400);
    }
    return respond({ m: 'deleted' }, 200);
  }

  @Get('/recent/:board')
  async getRecentActivity(): Promise<IResponse> {
    let response;

    try {
      response = await BoardService.getRecentActivity();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  @Patch('/access/:board', [AuthService.authenticate, AdminMiddleware.isAdmin])
  async updateBoardAccess(): Promise<IResponse> {
    try {
      await BoardService.updateBoardAccess();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ m: 'updated' }, 200);
  }
}
