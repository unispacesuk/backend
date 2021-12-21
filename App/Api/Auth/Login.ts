import { LoginService } from '@Services/Auth/LoginService';
import { AuthenticationService as AuthService } from '@Services/Auth/AuthenticationService';
import { UserModel } from '@Models';
import { request, response, Route } from '@Requests';
/**
 * All endpoints related to login
 */
export class Login extends Route {
  constructor() {
    super();
    this.createRoute({
      method: 'get',
      path: '/login',
      controller: this.doLogin,
    });
  }

  async doLogin() {
    /*
    This seems confusing, but,
      the user constant will have a body of type IUserResponse and findUser requires a UserInterface.
     */
    const user: UserModel | null = await LoginService.findUser(request().body);

    if (!user)
      return response().status(200).send({
        error: 400,
        message: 'incorrect details',
      });

    const token = AuthService.generateToken(user);
    response().status(200).send({ token });
  }
}
