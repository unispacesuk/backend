import { LoginService } from '../../Services/Auth/LoginService';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { request } from '../../Core/Routing';
import { IResponse } from '../../Interfaces';
import { Controller, Post } from '../../Core/Decorators';
/**
 * All endpoints related to login
 */
@Controller('/auth')
export class LoginController {
  @Post('/login')
  async doLogin(): Promise<IResponse> {

    // TODO: any? no
    const user: any = await LoginService.findUser(request().body);

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
