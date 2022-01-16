import { Controller, Get, Post, Patch } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { IResponse } from '../../Interfaces';
import { respond } from '../../Core/Routing';

@Controller('/thread', [AuthService.authenticate])
export class ThreadController {
  @Post('/add')
  async addNewThread(): Promise<IResponse> {
    return respond('added thread', 200);
  }

  @Get('/all')
  async getAllThreads(): Promise<IResponse> {
    return respond('all threads', 200);
  }

  @Get('/all/:thread')
  async getAllReplies(): Promise<IResponse> {
    return respond('all replies of a thread', 200);
  }

  @Patch('/:thread')
  async editThread(): Promise<IResponse> {
    return respond('thread edited', 200);
  }

  @Patch('/:thread/:reply')
  async editReply(): Promise<IResponse> {
    return respond('reply edited', 200);
  }

  @Post('/add/:thread')
  async addNewReply(): Promise<IResponse> {
    return respond('replied to a thread', 200);
  }
}
