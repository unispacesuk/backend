import { Controller, Get, Post } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { IResponse } from '../../Interfaces';
import { AnswerService } from '../../Services/Question/AnswerService';
import { respond } from '../../Core/Routing';

@Controller('/answer', [AuthService.authenticate])
export class AnswerController {
  /**
   * Add an answer
   */
  @Post('/:id')
  async addAnswer(): Promise<IResponse> {
    const answer = await AnswerService.addAnswer().catch((e) => {
      console.log(e);
      respond(
        {
          error: e,
        },
        400
      );
    });

    return respond(
      {
        answer,
      },
      200
    );
  }

  /**
   * Get all answers
   */
  @Get('/all/:id')
  async getAnswers(): Promise<IResponse> {
    const answers = await AnswerService.getAnswers().catch((e) => {
      console.log(e);
      return respond(
        {
          error: e,
        },
        400
      );
    });

    return respond(
      {
        answers,
      },
      200
    );
  }

  // TODO: upvote and downvote
}
