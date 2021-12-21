import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Config } from '../../Config';
import { request, response } from '@Requests';
import { middleware } from '@Decorators';

/**
 * This is the authentication middleware
 * The payload data will be used to get the user details and verify other user related data
 */
export class AuthenticationService {
  static token = '';
  private static _config = new Config();

  // TODO: Something wrong with the model. please fix
  static generateToken(data: any): string {
    this.token = sign(data, this._config.secret, {
      algorithm: 'HS256',
      expiresIn: '5 days',
    });

    return this.token;
  }

  public static verifyToken(token: string): Promise<JwtPayload | undefined> {
    return new Promise((resolve, reject) => {
      verify(token, this._config.secret, (error, payload) => {
        if (error) reject(error);
        resolve(payload);
      });
    });
  }

  /**
   * Authentication middleware method
   */
  @middleware()
  public static async authenticate() {
    const token: string | undefined = request().headers?.authorization?.split(' ')[1];

    if (!token)
      return response().status(200).send({
        error: 400,
        reason: 'no authorization token provided',
      });
  }
}
