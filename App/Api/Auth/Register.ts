import { RegisterService } from '@Services/Auth/RegisterService';
import { UserInterface } from '../../Interfaces/UserInterface';
import { request, response, Route } from '@Requests';

/**
 * All endpoints related to register
 */
export class Register extends Route {
  constructor() {
    super();
    this.createRoute({
      method: 'post',
      path: '/register',
      controller: this.doRegister,
    });
  }

  async doRegister() {
    const user: UserInterface = request().body;

    // username has to be larger than 5 characters
    if (user.username.length <=5) {
      return response().status(200).send({
        code: 400,
        message: 'username has to be larger than 5 characters'
      });
    }

    // password has to be larger than 8 characters
    if (user.not_username.length <= 8) {
      return response().status(200).send({
        code: 400,
        message: 'password has to be larger than 8 characters'
      });
    }

    // check for a valid email
    if (!user.email.match(/\w([a-z0-9_.-]+)(@)([a-z0-9_.-]+)[.]([a-z0-9]+)/g)) {
      return response().status(200).send({
        code: 400,
        message: 'your email is not a valid email'
      });
    }

    // check if the username is already in the database
    const usernameExists = await Promise.resolve(
      RegisterService.findOne({
        field: 'username',
        value: user.username,
      })
    );
    if (usernameExists.rows.length > 0)
      return response().status(200).send({
        code: 400,
        username: user.username,
        message: 'username already registered',
      });

    // check if the email is already in the database
    const emailExists = await Promise.resolve(
      RegisterService.findOne({
        field: 'email',
        value: user.email,
      })
    );
    if (emailExists.rows.length > 0)
      return response().status(200).send({
        code: 400,
        email: user.email,
        message: 'email already registered',
      });

    // register the user or error is something is wrong
    try {
      await Promise.resolve(RegisterService.createUser(user));
      return response().status(200).send({ code: 200, message: 'user registered successfully' });
    } catch (e) {
      console.log(e);
      return response().status(200).send({ code: 400, message: 'something went wrong' });
    }
  }
}
