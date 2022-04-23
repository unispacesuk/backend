import {
  AuthenticationService as AuthService,
  AuthenticationService as authService,
} from '../../Services/Auth/AuthenticationService';
import { TokenExpiredError } from 'jsonwebtoken';
import { request, respond } from '../../Core/Routing';
import { Controller, Post } from '../../Core/Decorators';
import { IResponse, IUser } from '../../Interfaces';
import { LoginService } from '../../Services/Auth/LoginService';
import { RegisterService } from '../../Services/Auth/RegisterService';
import { hash } from 'bcrypt';

// TODO: verify the current token exp and reject if already expired

/**
 * Dont think this route will get used so often... But still keep it here
 */
@Controller('/auth')
export class AuthenticationController {
  @Post('/authenticate')
  async authenticate() {
    const { authorization } = request().headers();
    const token = authorization?.split(' ')[1];

    if (!token) {
      return respond({ error: 'No token provided on the request.' }, 400);
    }

    let payload: any;
    try {
      payload = await authService.verifyToken(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return respond({ error: 'Token expired. Please login again.' }, 401);
      } else {
        console.log(e);
        return respond({ error: 'Something went wrong.' }, 400);
      }
    }

    let user;
    try {
      user = await LoginService.getUserData(payload.id);
    } catch (e) {
      console.log(e);
      return respond({ error: e }, 400);
    }

    return respond({ user }, 200);
  }

  // refactor later on
  @Post('/isadmin')
  async isAdmin(): Promise<IResponse> {
    const { authorization } = request().headers();
    console.log(authorization);

    return respond({ message: 'hi' }, 200);
  }

  // register
  @Post('/register')
  async doRegister(): Promise<IResponse> {
    const user: IUser = request().body();

    // username has to be larger than 5 characters
    if (user.username.length < 5) {
      return respond({ error: 'Username has to be larger than 5 characters.' }, 401);
    }

    // password has to be larger than 8 characters
    if (user.not_username.length <= 8) {
      return respond({ error: 'Password has to be larger than 8 characters.' }, 401);
    }

    // check for a valid email
    if (!user.email.match(/\w([a-z0-9_.-]+)(@)([a-z0-9_.-]+)[.]([a-z0-9]+)/g)) {
      return respond({ error: 'The email entered is not a valid email.' }, 401);
    }

    // check if the username is already in the database
    const usernameExists = await Promise.resolve(
      RegisterService.findOne({
        field: 'username',
        value: user.username,
      })
    );
    if (usernameExists.rows.length > 0)
      return respond({ error: 'Username already registered.' }, 401);

    // check if the email is already in the database
    const emailExists = await Promise.resolve(
      RegisterService.findOne({
        field: 'email',
        value: user.email,
      })
    );
    if (emailExists.rows.length > 0) return respond({ error: 'Email already registered.' }, 401);

    // register the user or error is something is wrong
    try {
      await Promise.resolve(RegisterService.createUser(user));
      return respond(
        {
          message:
            'Account successfully registered.\nPlease check your inbox for a confirmation email.',
        },
        200
      );
    } catch (e) {
      return respond({ error: 'Something went wrong.' }, 400);
    }
  }

  // login
  @Post('/login')
  async doLogin(): Promise<IResponse> {
    // TODO: any? no
    const user: any = await LoginService.findUser(request().body());

    if (!user) {
      return respond({ error: 'No user found with those details.' }, 401);
    }

    const token = AuthService.generateToken(user);
    return respond({ user, token }, 200);
  }

  // change password
  @Post('/change-password')
  async changePassword(): Promise<IResponse> {
    const { email } = request().body();

    console.log(AuthService.generateRecoveryToken(email));

    return respond({ message: 'Email sent with success.' }, 200);
  }

  // verify password token
  @Post('/verify-password-token')
  async verifyPasswordToken(): Promise<IResponse> {
    const { token } = request().body();

    try {
      await AuthService.verifyToken(token);
    } catch (error) {
      return respond({ error }, 401);
    }

    return respond({ message: 'valid token' }, 200);
  }

  // update password
  @Post('/update-password')
  async updatePassword(): Promise<IResponse> {
    const { token, password, passwordConfirm } = request().body();

    if (password !== passwordConfirm) {
      return respond({ error: 'Passwords do not match.' }, 401);
    }

    try {
      const { email } = await AuthService.verifyToken(token);
      await AuthService.updatePassword(await hash(password, 10), email);
    } catch (error) {
      return respond({ error }, 401);
    }

    return respond({ message: 'Password updated with success.' }, 200);
  }
}
