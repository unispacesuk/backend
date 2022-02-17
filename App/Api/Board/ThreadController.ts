import { Controller, Get, Post, Patch, Delete } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { IResponse } from '../../Interfaces';
import { respond } from '../../Core/Routing';
import { ThreadService } from '../../Services/Board/ThreadService';

@Controller('/thread')
export class ThreadController {
  @Get('/:id')
  async getThread(): Promise<IResponse> {
    const thread = await ThreadService.getThread();
    return respond({ thread }, 200);
  }

  @Post('/add', [AuthService.authenticate])
  async addNewThread(): Promise<IResponse> {
    const thread = await ThreadService.createNewThread();
    return respond({ thread }, 200);
  }

  /**
   * To delete only owner or admins!!!!
   */
  @Delete('/:id', [AuthService.authenticate])
  async deleteThread(): Promise<IResponse> {
    await ThreadService.deleteThread();
    return respond({ message: 'Thread Deleted' }, 200);
  }

  @Get('/all')
  async getAllThreads(): Promise<IResponse> {
    return respond('all threads', 200);
  }

  @Get('/all/:thread')
  async getAllReplies(): Promise<IResponse> {
    return respond('all replies of a thread', 200);
  }

  @Patch('/:thread', [AuthService.authenticate])
  async editThread(): Promise<IResponse> {
    return respond('thread edited', 200);
  }

  @Patch('/:thread/:reply', [AuthService.authenticate])
  async editReply(): Promise<IResponse> {
    return respond('reply edited', 200);
  }

  @Post('/add/:thread', [AuthService.authenticate])
  async addNewReply(): Promise<IResponse> {
    return respond('replied to a thread', 200);
  }
}
