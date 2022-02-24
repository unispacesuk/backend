import { AuthenticationService as authService } from '../../Services/Auth/AuthenticationService';
import {IJwtPayload, UserRole} from '../../Interfaces';
import { file, param, request, respond } from '../../Core/Routing';
import { Connection } from '../../Config';
import { UserModel } from '../../Models';

export class UserService {
  private static _client = Connection.client;

  /**
   * Get the user id from the token
   */
  public static async getUserId(token: string) {
    try {
      const { _id } = <IJwtPayload>await authService.verifyToken(token);
      return _id;
    } catch (error) {
      return respond({ error }, 400);
    }
  }

  public static async getUserData() {
    const userId = param('userId');

    return new Promise((resolve, reject) => {
      this._client.query('SELECT * FROM users WHERE _id = $1', [userId], (error, result) => {
        if (error) return reject();
        resolve(UserModel(result.rows[0]));
      });
    });
  }

  public static async setUserAvatar() {
    const userId = request().data('userId');

    return new Promise((resolve, reject) => {
      this._client.query(
        'UPDATE users SET avatar = $1 WHERE _id = $2 RETURNING avatar',
        [file()?.filename, userId],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.rows[0]);
        }
      );
    });
  }

  /**
   * Get the user role using the id from the token
   */
  public static async getUserRole(): Promise<UserRole> {
    const userId = request().data('userId');

    return new Promise((resolve, reject) => {
      this._client.query(
        'SELECT role_id FROM user_roles WHERE user_id = $1',
        [userId],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.rows[0]);
        }
      );
    });
  }
}
