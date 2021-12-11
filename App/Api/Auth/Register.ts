import { Router, Request, Response } from 'express';
import { RegisterService } from '../../Services/Auth/RegisterService';
import { UserInterface } from '../../Interfaces/UserInterface';

/**
 * All endpoints related to register
 */
export class Register {
  constructor(private _registerRoute: Router = Router()) {
    this._registerRoute.post('/register', this.doRegister);
  }

  async doRegister(req: Request, res: Response) {
    const user: UserInterface = req.body;

    // check if the username is already in the database
    const usernameExists = await Promise.resolve(
      RegisterService.findOne({
        field: 'username',
        value: user.username,
      })
    );
    if (usernameExists.rows.length > 0)
      return res.status(200).send({
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
      return res.status(200).send({
        error: 400,
        email: user.email,
        message: 'email already registered',
      });

    // register the user or error is something is wrong
    try {
      await Promise.resolve(RegisterService.createUser(user));
      return res.status(200).send({ error: null, message: 'user registered successfully' });
    } catch (e) {
      console.log(e);
      return res.status(200).send({ error: 400, message: 'something went wrong' });
    }
  }

  get registerRoute(): Router {
    return this._registerRoute;
  }
}
