import { Controller, Get, Post } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { IResponse } from '../../Interfaces';
import { AnswerService } from '../../Services/Question/AnswerService';
import { param, respond } from '../../Core/Routing';

@Controller('/answer')
export class AnswerController {
  /**
   * Add an answer
   */
  @Post('/:id', [AuthService.authenticate])
  async addAnswer(): Promise<IResponse> {
    if (isNaN(param('id'))) {
      return respond({ error: 'Invalid question id.' }, 400);
    }

    const answer = await AnswerService.addAnswer().catch((e) => {
      respond({ error: e }, 400);
    });

    return respond({ answer }, 200);
  }

  /**
   * Get all answers
   * @id is the id of the question that we want the answers for
   */
  @Get('/all/:id')
  async getAnswers(): Promise<IResponse> {
    if (isNaN(param('id'))) {
      return respond({ error: 'Invalid question id.' }, 400);
    }

    let answers;
    try {
      answers = await AnswerService.getAnswers();
    } catch (e) {
      return respond({ error: e }, 400);
    }

    return respond({ answers }, 200);
  }

  @Post('/:id/markbest', [AuthService.authenticate])
  async makeTopQuestion() {
    if (isNaN(param('id'))) {
      return respond({ error: 'Invalid answer id.' }, 400);
    }

    try {
      await AnswerService.markAsBest();
    } catch (e) {
      return respond({ error: e }, 400);
    }

    return respond({ message: 'done' }, 200);
  }

  // TODO: upvote and downvote
}
