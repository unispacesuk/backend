import { request, Route } from '@Requests';
import { AuthenticationService as authService } from '@Services/Auth/AuthenticationService';
import { QuestionService } from '@Services/Question/QuestionService';
import { route } from '@Decorators';
import { IResponse } from '@Interfaces';
import { IQuestionModel } from '../../Models/QuestionModel';
import { UserService } from '@Services/User/UserService';

export class QuestionController extends Route {
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
    this.createRoute({
      method: 'post',
      path: '/post',
      controller: this.postNew,
      middlewares: [authService.authenticate],
    });
    // this can be patch or put... we send the id as part of the body 🤔
    this.createRoute({
      method: 'patch',
      path: '/update',
      controller: this.update,
      middlewares: [authService.authenticate],
    });
    this.createRoute({
      method: 'delete',
      path: '/delete/:id',
      controller: this.deleteQuestion,
      middlewares: [authService.authenticate],
    });
  }

  /**
   * Get one question
   */
  @route()
  async getOne(): Promise<IResponse> {
    const { id } = request().parameters;
    // const id = request<'dddd'>('id');
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

  /**
   * Get all questions
   * TODO: REFACTOR THE ERROR HANDLING HERE
   */
  @route()
  async getAll(): Promise<IResponse> {
    const response = await QuestionService.getAll().catch((error) => console.log(error));

    return {
      code: 200,
      body: {
        response,
      },
    };
  }

  /**
   * Post a new question
   */
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

  /**
   * Update question
   * Note: only the owner / staff / admin / mod will be able to update the questions.
   */
  @route()
  async update(): Promise<IResponse> {
    let question;

    // userCanEdit() or userIdStaff()
    if (!(await userCanUpdate())) {
      return {
        code: 400,
        body: {
          message: 'you cannot edit this question',
        },
      };
    }

    try {
      question = await QuestionService.updateQuestion();
    } catch (error) {
      console.log(error);
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
        message: 'question updated',
        question,
      },
    };
  }

  /**
   * Delete a question
   */
  @route()
  async deleteQuestion(): Promise<IResponse> {
    let response;
    // userCanEdit() or userIdStaff()
    if (!(await userCanUpdate())) {
      return {
        code: 400,
        body: {
          message: 'you cannot delete this question',
        },
      };
    }

    try {
      (await QuestionService.deleteQuestion()) ?
        response = 'question deleted' : response = 'could not delete the question';
    } catch (error) {
      return {
        code: 400,
        body: {
          message: error,
        }
      };
    }

    return {
      code: 200,
      body: {
        message: response,
      },
    };
  }
}

// check if the user is allowed to delete the question
async function userCanUpdate(): Promise<boolean> {
  const currentUser = await UserService.getUserId(request().token);
  const { userId } = <IQuestionModel>(
    await QuestionService.getQuestion(request().body._id || request().parameters.id)
  );

  return currentUser === userId;
}
