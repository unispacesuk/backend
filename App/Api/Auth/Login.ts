import { Router, Request, Response } from 'express';
import { LoginService } from '../../Services/Auth/LoginService';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { UserModel } from '../../Models/UserModel';

/**
 * All endpoints related to login
 */
export class Login {
  constructor(private _loginRoute: Router = Router()) {
    this._loginRoute.get('/login', this.doLogin);
  }

  async doLogin(req: Request, res: Response) {
    /*
    This seems confusing, but,
      the user constant will have a body of type IUserResponse and findUser requires a UserInterface.
     */
    const user: UserModel | null = await LoginService.findUser(req.body);

    if (!user)
      return res.status(200).send({
        error: 400,
        message: 'incorrect details',
      });

    const token = AuthService.generateToken(user);
    res.status(200).send({ token });
  }

  get loginRoute(): Router {
    return this._loginRoute;
  }
}
