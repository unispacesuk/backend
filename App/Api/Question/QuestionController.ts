import { param, request, respond } from '../../Core/Routing';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { QuestionService } from '../../Services/Question/QuestionService';
import { IResponse, UserRole } from '../../Interfaces';
import { IQuestionModel } from '../../Models/QuestionModel';
import { UserService } from '../../Services/User/UserService';
import { Controller, Post, Get, Patch, Delete } from '../../Core/Decorators';
import { addEvent } from '../../Services/Util/EventService';

@Controller('/question')
export class QuestionController {
  /**
   * Get all questions
   */
  @Get('/all')
  async getAll(): Promise<IResponse> {
    let questions;
    try {
      questions = await QuestionService.getAll();
    } catch (e) {
      console.log(e);
      return respond({ error: e }, 400);
    }

    if (questions === undefined) {
      questions = [];
    }

    return respond({ questions }, 200);
  }

  /**
   * Get all from user
   */
  @Get('/user/:userId')
  async getAllFromUser() {
    if (isNaN(param('userId'))) {
      return respond({ error: 'Invalid user id.' }, 400);
    }

    const questions = await QuestionService.getAll().catch((e) => {
      console.log(e);
      respond({ error: e }, 400);
    });

    return respond({ questions }, 200);
  }

  /**
   * Get one question
   * TODO: Refactor
   */
  @Get('/:id')
  async getOne(): Promise<IResponse> {
    const { id } = param();

    if (isNaN(id)) {
      return respond({ error: 'Invalid question id.' }, 400);
    }

    // looks weird I know. but it is only because we can either get:
    //  - an empty array
    //  - an array of Questions
    // string because we want to send a response as a string. we can also just send an empty array and write the response in the frontend
    // try {
    const question = <IQuestionModel[] | string>await QuestionService.getQuestion(id).catch((e) => {
      console.log(e);
      return respond({ error: e }, 400);
    });

    if (question.length === 0) {
      respond({ m: 'No question found with that id.' }, 200);
    }

    return respond(
      {
        question,
      },
      200
    );
  }

  /**
   * Post a new question
   */
  @Post('/', [AuthService.authenticate])
  async postNew(): Promise<IResponse> {
    try {
      await QuestionService.postQuestion();
    } catch (e) {
      return respond({ error: e }, 400);
    }

    await addEvent('ADD_QUESTION').catch((e) => console.log(e));

    return respond({ message: 'question posted' }, 200);
  }

  /**
   * Update question
   * Note: only the owner / staff / admin / mod will be able to update the questions.
   */
  @Patch('/:id', [AuthService.authenticate])
  async update(): Promise<IResponse> {
    const userRole: UserRole = await UserService.getUserRole();

    if (isNaN(param('id'))) {
      return respond({ error: 'Invalid question id.' }, 400);
    }

    // userCanEdit() or userIdStaff()
    if (!(await userCanUpdate()) && userRole.role_id !== 1) {
      return respond({ error: 'You cannot edit this question.' }, 401);
    }

    let question;
    try {
      question = await QuestionService.updateQuestion();
    } catch (e) {
      return respond({ error: e }, 400);
    }

    await addEvent('EDIT_QUESTION').catch((e) => console.log(e));

    return respond({ message: 'question updated', question }, 200);
  }

  /**
   * Delete a question
   */
  @Delete('/:id', [AuthService.authenticate])
  async deleteQuestion(): Promise<IResponse> {
    const userRole: UserRole = await UserService.getUserRole();

    if (isNaN(param('id'))) {
      return respond({ error: 'Invalid questions id.' }, 400);
    }

    // userCanEdit() or userIsStaff()
    if (!(await userCanUpdate()) && userRole.role_id !== 1) {
      return respond({ error: 'You cannot delete this question.' }, 401);
    }

    let response;
    try {
      response = await QuestionService.deleteQuestion();
    } catch (e) {
      console.log(e);
      return respond({ error: e }, 401);
    }

    if (!response) {
      return respond({ error: 'Could not delete the question.' }, 401);
    }

    return respond({ response }, 200);
  }

  // Vote on the question
  @Post('/:id/vote/:type', [AuthService.authenticate])
  async doVote() {
    if (isNaN(param('id'))) {
      return respond({ error: 'Invalid question id.' }, 400);
    }

    try {
      await QuestionService.voteForQuestion();
    } catch (e) {
      console.log(e);
      return respond({ error: e }, 400);
    }

    return respond({ m: 'voted' }, 200);
  }

  // get users vote if logged in
  @Get('/myvote/:id', [AuthService.authenticate])
  async getVote() {
    let vote;
    try {
      vote = await QuestionService.getVote();
    } catch (e) {
      console.log(e);
      return respond({ error: e }, 400);
    }

    return respond({ vote }, 200);
  }
}

// check if the user is allowed to delete the question
async function userCanUpdate() {
  // const currentUser = await UserService.getUserId(request().token());
  const currentUser = await request().data('userId');
  const { userId } = <IQuestionModel>await QuestionService.getQuestion(param('id'));

  return currentUser === userId;
}
