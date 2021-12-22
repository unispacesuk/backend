import { response, Route } from '@Requests';
import { AuthenticationService as authService } from '@Services/Auth/AuthenticationService';
import { QuestionService } from '@Services/Question/QuestionService';

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

  async postNew() {
    let question;

    try {
      question = await QuestionService.postQuestion();
    } catch (error) {
      return response().status(400).send({
        code: 400,
        message: error,
      });
    }

    response().status(200).send({
      code: 200,
      message: 'question posted',
      _id: question._id,
    });
  }
}
