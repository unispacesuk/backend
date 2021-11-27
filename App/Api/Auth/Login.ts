import {Router, Request, Response, NextFunction} from "express";

/**
 * Login Endpoint
 */
export class Login {

  constructor(
    private readonly _login: Router = Router()
  ) {
    this._login.get('/login', this.doLogin);
  }

  async doLogin(req: Request, res: Response, next: NextFunction) {
    console.log('logged in...');
    res.status(200).send({message: 'Logged in'});
  }

  /**
   * Getter for the route
   */
  get route(): Router {
    return this._login;
  }

}