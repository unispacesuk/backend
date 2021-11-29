import {Router, Request, Response} from "express";
import {LoginService as loginService} from "../../Services/Auth/LoginService";
import {AuthenticationService as authService} from "../../Services/Auth/AuthenticationService";
import {MoreRequest} from "../../Interfaces/MoreRequest";

/**
 * All endpoints related to login
 */
export class Login {

  constructor(
    private _loginRoute: Router = Router()
  ) {
    this._loginRoute.get('/login', this.doLogin);
    this._loginRoute.get('/test', authService.authenticate, this.test);
  }

  async doLogin(req: Request, res: Response) {
    const user = await loginService.findUser(req.body);

    if (!user)
      return res.status(200).send({e: 'Not Found', m: 'User not found with those details'});

    const token = authService.generateToken(user);
    res.status(200).send({token});
  }

  /**
   * Just a test thingy
   * @param req
   * @param res
   */
  async test(req: MoreRequest, res: Response) {
    console.log(req.some);
    res.end();
  };

  get loginRoute(): Router {
    return this._loginRoute;
  }

}