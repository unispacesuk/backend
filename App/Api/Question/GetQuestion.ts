import { request, response, Route } from '@Requests';
import { AuthenticationService as authService } from '@Services/Auth/AuthenticationService';
import { QuestionService } from '@Services/Question/QuestionService';

export class GetQuestion extends Route {
  constructor() {
    super();
    this.createRoute({
      method: 'get',
      path: '/get/:id',
      controller: this.getOne,
      middlewares: [authService.authenticate],
    });
    this.createRoute({
      method: 'get',
      path: '/get/all',
      controller: () => {},
      middlewares: [authService.authenticate],
    });
    this.createRoute({
      method: 'get',
      path: '/get/user/:id',
      controller: () => {},
      middlewares: [authService.authenticate],
    });
  }

  public async getOne() {
    const { id } = request().parameters;
    const question = await QuestionService.getQuestion(id);

    response().status(200).send({
      code: 200,
      message: 'j'
    });
  }

  public async getAll() {}
}
