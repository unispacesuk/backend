import { AuthenticationService as authService } from '../../Services/Auth/AuthenticationService';
import { TokenExpiredError } from 'jsonwebtoken';
import { request, response } from '../../Core/Routing';
import { Controller, post } from '../../Core/Decorators';

// TODO: verify the current token exp and reject if already expired

/**
 * Dont think this route will get used so often... But still keep it here
 */
@Controller('/auth')
export class AuthenticationController {
  @post('/authenticate')
  async authenticate() {
    const { authorization } = request().headers;
    const token = authorization?.split(' ')[1];

    if (!token)
      return response().status(200).send({ e: 'No token', m: 'No token sent on the request' });

    let payload;
    try {
      payload = await authService.verifyToken(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return response()
          .status(200)
          .send({ e: 'Token expired', m: 'The token used to authenticate is expired' });
      } else {
        console.log(e);
      }
    }

    response().status(200).send({ payload });
  }
}
