import { sign, verify } from 'jsonwebtoken';
import { Config } from '../../Config';
import { request, response } from '../../Core/Routing';
import { middleware } from '../../Core/Decorators';
import { IJwtPayload } from '../../Interfaces';
import { UserModel } from '../../Models';

/**
 * This is the authentication middleware
 * The payload data will be used to get the user details and verify other user related data
 */
export class AuthenticationService {
  static token = '';
  private static _config = new Config();

  // TODO: Something wrong with the model. please fix
  static generateToken(data: UserModel): string {
    this.token = sign(data, this._config.secret, {
      algorithm: 'HS256',
      expiresIn: '5 days',
    });

    return this.token;
  }

  public static verifyToken(token: string): Promise<IJwtPayload | undefined> {
    return new Promise((resolve, reject) => {
      verify(token, this._config.secret, (error, payload) => {
        if (error) return reject(error);
        resolve(<IJwtPayload>payload);
      });
    });
  }

  /**
   * AuthenticationController middleware method
   */
  @middleware()
  public static async authenticate() {
    const token: string | undefined = request().headers?.authorization?.split(' ')[1];

    if (!token)
      return response().status(400).send({
        reason: 'no authorization token provided',
      });

    try {
      await AuthenticationService.verifyToken(token);
    } catch (error) {
      return response().status(400).send({
        message: 'invalid token signature',
      });
    }
  }
}
