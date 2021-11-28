import {Router, Request, Response} from 'express';
import {RegisterService as registerService} from '../../Services/Auth/RegisterService';

/**
 * All endpoints related to register
 */
export class Register {

  constructor(
    private _registerRoute: Router = Router()
  ) {
    this._registerRoute.get('/register', this.doRegister);
  }

  async doRegister(req: Request, res: Response) {

    // TODO username size, email check, password check

    // check if username exists
    if (await registerService.userExists('username', req.body.username))
      return res.status(200).send({error: 'Username already registered'});

    // check if email exists
    if (await registerService.userExists('email', req.body.email))
      return res.status(200).send({error: 'Email already registered'});

    let response;
    try {
      response = await registerService.saveUser(req.body);
    } catch (error) {
      return res.status(400).send({error: 'Could not register the user'});
    }

    res.status(200).send({message: response});
  }

  get registerRoute(): Router {
    return this._registerRoute;
  }

}