import { LoginService } from '../../Services/Auth/LoginService';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { UserModel } from '../../Models';
import { request, Route } from '../../Core/Routing';
import { route } from '../../Core/Decorators';
import { IResponse } from '../../Interfaces';
/**
 * All endpoints related to login
 */
export class LoginController extends Route {
  constructor() {
    super();
    this.createRoute({
      method: 'post',
      path: '/login',
      controller: this.doLogin,
    });
  }

  @route()
  async doLogin(): Promise<IResponse> {
    /*
    This seems confusing, but,
      the user constant will have a body of type IUserResponse and findUser requires a UserInterface.
     */
    const user: UserModel | null = await LoginService.findUser(request().body);

    if (!user)
      return {
        code: 400,
        body: {
          message: 'incorrect details',
        },
      };

    const token = AuthService.generateToken(user);
    return {
      code: 200,
      body: {
        token: token,
      },
    };
  }
}
