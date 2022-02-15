import { param, request, respond } from '../../Core/Routing';
import { AuthenticationService as authService } from '../../Services/Auth/AuthenticationService';
import { QuestionService } from '../../Services/Question/QuestionService';
import { IResponse } from '../../Interfaces';
import { IQuestionModel } from '../../Models/QuestionModel';
import { UserService } from '../../Services/User/UserService';
import { Controller, Post, Get, Patch, Delete } from '../../Core/Decorators';
import { addEvent } from '../../Services/Util/Events';

@Controller('/question', [authService.authenticate])
export class QuestionController {
  /**
   * Get all questions
   * TODO: REFACTOR THE ERROR HANDLING HERE
   */
  @Get('/all')
  async getAll(): Promise<IResponse> {
    const questions = await QuestionService.getAll().catch((error) => console.log(error));

    return respond({ questions }, 200);
  }

  /**
   * Get all from user
   */
  @Get('/user/:userId')
  async getAllFromUser() {
    const response = await QuestionService.getAll().catch((error) => console.log(error));

    return {
      code: 200,
      body: {
        response,
      },
    };
  }

  /**
   * Get one question
   */
  @Get('/:id')
  async getOne(): Promise<IResponse> {
    const { id } = param();
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
   * Post a new question
   */
  @Post('/')
  async postNew(): Promise<IResponse> {
    const question = await QuestionService.postQuestion().catch((e) => {
      return respond({ error: e }, 400);
    });

    await addEvent('ADD_QUESTION').catch((e) => console.log(e));

    return respond(
      {
        message: 'question posted',
        question,
      },
      200
    );
  }

  /**
   * Update question
   * Note: only the owner / staff / admin / mod will be able to update the questions.
   */
  @Patch('/')
  async update(): Promise<IResponse> {
    // let question;

    // userCanEdit() or userIdStaff()
    if (!(await userCanUpdate())) {
      return {
        code: 400,
        body: {
          message: 'you cannot edit this question',
        },
      };
    }

    // try {
    //   question = await QuestionService.updateQuestion();
    // } catch (error) {
    //   console.log(error);
    //   return {
    //     code: 400,
    //     body: {
    //       message: error,
    //     },
    //   };
    // }
    const question = await QuestionService.updateQuestion().catch((e) => console.log(e));

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
  @Delete('/:id')
  async deleteQuestion(): Promise<IResponse> {
    // let response;
    // userCanEdit() or userIsStaff()
    if (!(await userCanUpdate())) {
      respond({ error: 'You cannot delete this question.' }, 400);
    }

    const response = await QuestionService.deleteQuestion().catch((e) => {
      return respond({ error: e }, 401);
    });

    return respond({ m: response }, 200);
  }
}

// check if the user is allowed to delete the question
async function userCanUpdate() {
  // const currentUser = await UserService.getUserId(request().token());
  const currentUser = await request().data('userId');
  const { userId } = <IQuestionModel>(
    await QuestionService.getQuestion(param('id'))
  );

  return currentUser === userId;
}
