import { Controller, Get, Post, Patch, Delete } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { IResponse } from '../../Interfaces';
import { param, respond } from '../../Core/Routing';
import { ThreadService } from '../../Services/Board/ThreadService';
import { RolesService } from '../../Services/Roles/RolesService';
import { UserService } from '../../Services/User/UserService';

@Controller('/thread')
export class ThreadController {
  @Get('/:thread')
  async getThread(): Promise<IResponse> {
    if (isNaN(param('thread'))) {
      return respond({ error: 'Invalid Thread id.' }, 400);
    }

    let thread;
    try {
      thread = await ThreadService.getThread();
    } catch (e) {
      console.log(e);
      return respond({ error: e }, 400);
    }

    if (thread === 0) {
      return respond({ message: 'This thread does not exist.' }, 200);
    }

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
  @Delete('/:thread', [AuthService.authenticate])
  async deleteThread(): Promise<IResponse> {
    if (isNaN(param('thread'))) {
      return respond({ error: 'Invalid Thread id.' }, 400);
    }

    try {
      const thread = await ThreadService.getThread();
      if (!RolesService.isUserAdmin && UserService.getUserId !== thread.id) {
        return respond({ error: 'You cannot delete this thread.' }, 400);
      }
      await ThreadService.deleteThread();
    } catch (e) {
      console.log(e);
      return respond({ error: 'Something went wrong.' }, 400);
    }
    return respond({ message: 'Thread Deleted' }, 200);
  }

  /**
   * @Deprecated ?
   */
  @Get('/all')
  async getAllThreads(): Promise<IResponse> {
    return respond({ m: 'all threads' }, 200);
  }

  // fetch all replies from a thread
  @Get('/:thread/replies')
  async getAllReplies(): Promise<IResponse> {
    if (isNaN(param('thread'))) {
      return respond({ error: 'Invalid thread id.' }, 400);
    }

    let response;
    try {
      response = await ThreadService.getAllReplies();
    } catch (e) {
      console.log(e);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    return respond({ response }, 200);
  }

  @Patch('/:thread', [AuthService.authenticate])
  async editThread(): Promise<IResponse> {
    if (isNaN(param('thread'))) {
      return respond({ error: 'Invalid thread id.' }, 400);
    }

    let response;
    try {
      response = await ThreadService.updateThread();
    } catch (e) {
      console.log(e);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    if (response) {
      return respond({ message: 'Thread updated.' }, 200);
    }

    return respond({ error: 'oops' }, 400);
  }

  // this is to edit a reply... can add maybe at a later stage?
  @Patch('/:thread/:reply', [AuthService.authenticate])
  async editReply(): Promise<IResponse> {
    return respond({ m: 'reply edited' }, 200);
  }

  @Post('/:thread/reply', [AuthService.authenticate])
  async addNewReply(): Promise<IResponse> {
    if (isNaN(param('thread'))) {
      return respond({ error: 'Invalid thread id.' }, 400);
    }

    let response;
    try {
      response = await ThreadService.addNewReply();
    } catch (e) {
      console.log(e);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    if (response) {
      return respond({ response }, 200);
    }

    return respond({ m: '........' }, 200);
  }
}
