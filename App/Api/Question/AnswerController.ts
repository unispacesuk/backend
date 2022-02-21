import { Controller, Get, Post } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { IResponse } from '../../Interfaces';
import { AnswerService } from '../../Services/Question/AnswerService';
import { respond } from '../../Core/Routing';

@Controller('/answer')
export class AnswerController {
  /**
   * Add an answer
   */
  @Post('/:id', [AuthService.authenticate])
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
   * @id is the id of the question that we want the answers for
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

  @Post('/:id/makebest', [AuthService.authenticate])
  async makeTopQuestion() {
    await AnswerService.markAsBest().catch((e) => {
      console.log(e);
      return respond({ error: e }, 400);
    });

    return respond({ message: 'done' }, 200);
  }

  // TODO: upvote and downvote
}
