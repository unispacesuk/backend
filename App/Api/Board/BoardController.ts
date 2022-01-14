import { Controller, Get } from '../../Core/Decorators';

@Controller('/board')
export class BoardController {
  @Get('/')
  hello() {}
}
