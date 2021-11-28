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
    let response;
    try {
      response = await registerService.createUser(req.body);
    } catch (e) {
      return res.status(400).send({e: 'Error', m: 'Could not register the user'});
    }

    res.status(200).send({m: response});
  }

  get registerRoute(): Router {
    return this._registerRoute;
  }

}