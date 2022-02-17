import { AuthenticationService as authService } from '../../Services/Auth/AuthenticationService';
import { TokenExpiredError } from 'jsonwebtoken';
import { request, respond, response } from '../../Core/Routing';
import { Controller, Post } from '../../Core/Decorators';
import { IResponse } from '../../Interfaces';
import { LoginService } from '../../Services/Auth/LoginService';

// TODO: verify the current token exp and reject if already expired

/**
 * Dont think this route will get used so often... But still keep it here
 */
@Controller('/auth')
export class AuthenticationController {
  @Post('/authenticate')
  async authenticate() {
    const { authorization } = request().headers();
    const token = authorization?.split(' ')[1];

    if (!token)
      return response().status(200).send({ e: 'No token', m: 'No token sent on the request' });

    let payload: any;
    try {
      payload = await authService.verifyToken(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return respond(
          {
            error: 'Token expired. Please login again.',
          },
          401
        );
      } else {
        console.log(e);
      }
    }

    const user: any = await LoginService.getUserData(payload.id);

    return respond(
      {
        user,
      },
      200
    );
  }

  // refactor later on
  @Post('/isadmin')
  async isAdmin(): Promise<IResponse> {
    const { authorization } = request().headers();
    console.log(authorization);

    return respond({ message: 'hi' }, 200);
  }
}
