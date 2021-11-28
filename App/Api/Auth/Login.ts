import {Router, Request, Response, NextFunction} from "express";
import {LoginService as loginService} from "../../Services/Auth/LoginService";

/**
 * All endpoints related to login
 */
export class Login {

  constructor(
    private _loginRoute: Router = Router()
  ) {
    this._loginRoute.get('/login', this.doLogin);
  }

  async doLogin(req: Request, res: Response) {
    const user = await loginService.findUser(req.body);
    res.status(200).send(user);
  }

  get loginRoute(): Router {
    return this._loginRoute;
  }

}