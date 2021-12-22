import { request, Route } from '@Requests';
import { AuthenticationService as authService } from '@Services/Auth/AuthenticationService';
import { QuestionService } from '@Services/Question/QuestionService';
import { route } from '@Decorators';
import { IResponse } from '@Interfaces';
import { IQuestionModel } from '../../Models/QuestionModel';

export class GetQuestion extends Route {
  constructor() {
    super();
    this.createRoute({
      method: 'get',
      path: '/get/all',
      controller: this.getAll,
      middlewares: [authService.authenticate],
    });
    this.createRoute({
      method: 'get',
      path: '/get/:id',
      controller: this.getOne,
      middlewares: [authService.authenticate],
    });
    this.createRoute({
      method: 'get',
      path: '/get/user/:userId',
      controller: this.getAll,
      middlewares: [authService.authenticate],
    });
  }

  @route()
  async getOne(): Promise<IResponse> {
    const { id } = request().parameters;
    let response;

    // looks weird I know. but it is only because we can either get:
    //  - an empty array
    //  - an array of Questions
    // string because we want to send a response as a string. we can also just send an empty array and write the response in the frontend
    try {
      response = <IQuestionModel[] | string>await QuestionService.getQuestion(id);
    } catch (error) {
      return {
        code: 400,
        body: {
          message: 'no question found with that criteria',
        },
      };
    }
    // if 0 then say no question found
    response.length === 0 ? (response = 'no question found with that id') : '';

    return {
      code: 200,
      body: {
        response,
      },
    };
  }

  @route()
  async getAll() {
    const response = await QuestionService.getAll().catch((error) => console.log(error));

    return <IResponse>{
      code: 200,
      body: {
        response,
      },
    };
  }
}
