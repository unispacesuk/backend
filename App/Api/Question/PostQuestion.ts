import { response, Route } from '@Requests';
import { AuthenticationService as authService } from '@Services/Auth/AuthenticationService';
import { QuestionService } from '@Services/Question/QuestionService';
import { route } from '@Decorators';
import { IResponse } from '@Interfaces';

export class PostQuestion extends Route {
  constructor() {
    super();
    this.createRoute({
      method: 'post',
      path: '/post',
      controller: this.postNew,
      middlewares: [authService.authenticate],
    });
  }

  @route()
  async postNew(): Promise<IResponse> {
    let question;

    try {
      question = await QuestionService.postQuestion();
    } catch (error) {
      return {
        code: 400,
        body: {
          message: error,
        },
      };
    }

    return {
      code: 200,
      body: {
        message: 'question posted',
        question,
      },
    };
  }
}
