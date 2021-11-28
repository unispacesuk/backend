import {Router, Request, Response} from "express";
import {AuthenticationService as authService} from "../../Services/Auth/AuthenticationService";
import {TokenExpiredError} from "jsonwebtoken";
import {rejects} from "assert";

// TODO: verify the current token exp and reject if already expired

export class Authentication {

  constructor(
    private _authRoute: Router = Router()
  ) {
    this._authRoute.post('/authenticate', this.authenticate);
  }

  async authenticate(req: Request, res: Response) {
    const {authorization} = req.headers;
    const token = authorization?.split(' ')[1];

    if (!token)
      return res.status(200).send({e: 'No token', m: 'No token sent on the request'});

    let payload;
    try {
      payload = await authService.verifyToken(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return res.status(200).send({e: 'Token expired', m: 'The token used to authenticate is expired'});
      } else {
        console.log(e);
      }
    }

    res.status(200).send({payload});
  }

  get authRoute(): Router {
    return this._authRoute;
  }

}