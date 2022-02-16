import { RegisterService } from '../../Services/Auth/RegisterService';
import { IResponse, IUser } from '../../Interfaces';
import {request, respond} from '../../Core/Routing';
import { Controller, Post } from '../../Core/Decorators';

/**
 * All endpoints related to register
 */
@Controller('/auth')
export class RegisterController {
  @Post('/register')
  async doRegister(): Promise<IResponse> {
    const user: IUser = request().body();

    // username has to be larger than 5 characters
    if (user.username.length <= 5) {
      return respond({
        error: 'Username has to be larger than 5 characters.'
      }, 401);
    }

    // password has to be larger than 8 characters
    if (user.not_username.length <= 8) {
      return respond({
        error: 'Password has to be larger than 8 characters.'
      }, 401);
    }

    // check for a valid email
    if (!user.email.match(/\w([a-z0-9_.-]+)(@)([a-z0-9_.-]+)[.]([a-z0-9]+)/g)) {
      return respond({
        error: 'The email entered is not a valid email.'
      }, 401);
    }

    // check if the username is already in the database
    const usernameExists = await Promise.resolve(
      RegisterService.findOne({
        field: 'username',
        value: user.username,
      })
    );
    if (usernameExists.rows.length > 0)
      return respond({
        error: 'Username already registered.'
      }, 401);

    // check if the email is already in the database
    const emailExists = await Promise.resolve(
      RegisterService.findOne({
        field: 'email',
        value: user.email,
      })
    );
    if (emailExists.rows.length > 0)
      return respond({
        error: 'Email already registered.'
      }, 401);

    // register the user or error is something is wrong
    try {
      await Promise.resolve(RegisterService.createUser(user));
      return respond({
        message: 'Account successfully registered.\nPlease check your inbox for a confirmation email.'
      }, 200);
    } catch (e) {
      return respond({
        error: 'Something went wrong.'
      }, 400);
    }
  }
}
