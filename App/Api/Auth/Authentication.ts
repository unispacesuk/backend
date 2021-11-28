import {Router, Request, Response} from "express";

export class Authentication {

  constructor(
    private _authRoute: Router = Router()
  ) {
    this._authRoute.post('/authenticate', this.authenticate);
  }

  authenticate(req: Request, res: Response) {

    res.status(200).send({m: 'Hi from the auth route'});
  }

  get authRoute(): Router {
    return this._authRoute;
  }

}