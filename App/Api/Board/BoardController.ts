import { Controller, Post, Get } from '../../Core/Decorators';

@Controller('/board')
export class BoardController {
  @Post('/add')
  async addNewBoard() {

  }

  @Get('/get/all')
  async getAllBoards() {

  }
}
