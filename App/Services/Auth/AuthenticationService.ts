import { sign, verify } from 'jsonwebtoken';
import { Config, Connection } from '../../Config';
import { request, respond } from '../../Core/Routing';
import { Middleware, Next } from '../../Core/Decorators';
import { IUser } from '../../Interfaces';

/**
 * This is the authentication middleware
 * The payload data will be used to get the user details and verify other user related data
 */
export class AuthenticationService {
  static token = '';
  private static _config = new Config();
  private static _client = Connection.client;

  // TODO: Something wrong with the model. please fix
  static generateToken(data: IUser): string {
    // @ts-ignore
    const _id = data.id;
    this.token = sign({ id: _id, username: data.username }, this._config.secret, {
      algorithm: 'HS256',
      expiresIn: '5 days',
    });

    return this.token;
  }

  public static verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      verify(token, this._config.secret, { algorithms: ['HS256'] }, (error, payload) => {
        if (error) return reject(error.message);
        resolve(payload);
      });
    });
  }

  public static generateRecoveryToken(email: string): string {
    return sign({ email }, this._config.secret, {
      algorithm: 'HS256',
      expiresIn: '15 minutes',
    });
  }

  public static updatePassword(password: string, email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._client.query(
        'UPDATE users SET not_username = $1 WHERE email = $2',
        [password, email],
        (error) => {
          if (error) return reject(error);
          resolve(true);
        }
      );
    });
  }

  /**
   * AuthenticationController middleware method
   */
  @Middleware()
  public static async authenticate() {
    let token: string | undefined = request().headers().authorization;
    // const token: string = request().token();
    let payload;

    if (!token) {
      return respond({ error: 'No Authorization token provided.' }, 401);
    }

    token = token.split(' ')[1];

    try {
      payload = await AuthenticationService.verifyToken(token);
    } catch (e) {
      return respond({ error: e }, 401);
    }

    // this will add the id on the request object then we will be able to access it globally
    //    it will be refreshed on every request though...
    request().data({
      userId: payload?.id,
    });

    Next();
  }
}
