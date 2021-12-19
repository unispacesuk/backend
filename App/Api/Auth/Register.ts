import { Router } from 'express';
import { RegisterService } from '../../Services/Auth/RegisterService';
import { UserInterface } from '../../Interfaces/UserInterface';
import { request, response } from '../../Core/Requests';
import { Route } from "../../Core/Route/Route";

/**
 * All endpoints related to register
 */
export class Register extends Route {
  constructor(private _registerRoute: Router = Router()) {
    super();
    this.createRoute({
      method: 'post',
      path: '/register',
      controller: this.doRegister
    });
  }

  async doRegister() {
    const user: UserInterface = request().body;

    // check if the username is already in the database
    const usernameExists = await Promise.resolve(
      RegisterService.findOne({
        field: 'username',
        value: user.username,
      })
    );
    if (usernameExists.rows.length > 0)
      return response().status(200).send({
        error: 400,
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
        error: 400,
        email: user.email,
        message: 'email already registered',
      });

    // register the user or error is something is wrong
    try {
      await Promise.resolve(RegisterService.createUser(user));
      return response().status(200).send({ error: null, message: 'user registered successfully' });
    } catch (e) {
      console.log(e);
      return response().status(200).send({ error: 400, message: 'something went wrong' });
    }
  }

  get registerRoute(): Router {
    return this._registerRoute;
  }
}
