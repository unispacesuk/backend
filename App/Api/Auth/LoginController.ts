import { LoginService } from '../../Services/Auth/LoginService';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { request, respond } from '../../Core/Routing';
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
    const user: any = await LoginService.findUser(request().body());

    if (!user) {
      return respond(
        {
          error: 'No user found with those details.',
        },
        401
      );
    }

    const token = AuthService.generateToken(user);
    return respond(
      {
        user,
        token,
      },
      200
    );
  }
}
