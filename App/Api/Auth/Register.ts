import {Router, Request, Response, NextFunction} from "express";

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

    res.status(200).send({m: 'hi from register'});
  }

  get registerRoute(): Router {
    return this._registerRoute;
  }

}