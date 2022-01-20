import { Controller, Get } from '../../Core/Decorators';
import { respond } from '../../Core/Routing';
import { IResponse } from '../../Interfaces';

@Controller('/test')
export class TestController {
  @Get('/hi')
  async testMethod(): Promise<IResponse> {
    return respond({ m: 'hello there' }, 200);
  }
}
