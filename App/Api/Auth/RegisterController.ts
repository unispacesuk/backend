import { RegisterService } from '../../Services/Auth/RegisterService';
import { IResponse, IUser } from '../../Interfaces';
import { request } from '../../Core/Routing';
import { Controller, post } from '../../Core/Decorators';

/**
 * All endpoints related to register
 */
@Controller('/auth')
export class RegisterController {
  @post('/register')
  async doRegister(): Promise<IResponse> {
    const user: IUser = request().body;

    // username has to be larger than 5 characters
    if (user.username.length <= 5) {
      return {
        code: 400,
        body: {
          message: 'username has to be larger than 5 characters',
        },
      };
    }

    // password has to be larger than 8 characters
    if (user.not_username.length <= 8) {
      return {
        code: 400,
        body: {
          message: 'password has to be larger than 8 characters',
        },
      };
    }

    // check for a valid email
    if (!user.email.match(/\w([a-z0-9_.-]+)(@)([a-z0-9_.-]+)[.]([a-z0-9]+)/g)) {
      return <IResponse>{
        code: 400,
        body: {
          message: 'your email is not a valid email',
        },
      };
    }

    // check if the username is already in the database
    const usernameExists = await Promise.resolve(
      RegisterService.findOne({
        field: 'username',
        value: user.username,
      })
    );
    if (usernameExists.rows.length > 0)
      return {
        code: 400,
        body: {
          username: user.username,
          message: 'username already registered',
        },
      };

    // check if the email is already in the database
    const emailExists = await Promise.resolve(
      RegisterService.findOne({
        field: 'email',
        value: user.email,
      })
    );
    if (emailExists.rows.length > 0)
      return {
        code: 400,
        body: {
          email: user.email,
          message: 'email already registered',
        },
      };

    // register the user or error is something is wrong
    try {
      await Promise.resolve(RegisterService.createUser(user));
      return {
        code: 200,
        body: {
          message: 'user registered successfully',
        },
      };
    } catch (e) {
      return {
        code: 400,
        body: {
          message: 'something went wrong',
        },
      };
    }
  }
}
