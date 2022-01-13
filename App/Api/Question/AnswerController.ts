import { Controller, Post, Get } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { IResponse } from '../../Interfaces';
import { AnswerService } from '../../Services/Question/AnswerService';

@Controller('/answer', [AuthService.authenticate])
export class AnswerController {
  /**
   * Add an answer
   */
  @Post('/add/:id')
  async addAnswer(): Promise<IResponse> {
    await AnswerService.addAnswer();
    return {
      code: 200,
      body: {
        message: 'answered',
      },
    };
  }

  /**
   * Get all answers
   */
  @Get('/get/:id')
  async getAnswers(): Promise<IResponse> {
    const answers = await AnswerService.getAnswers();
    return {
      code: 200,
      body: {
        message: answers,
      },
    };
  }

  // TODO: upvote and downvote
}
