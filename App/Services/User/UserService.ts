import { AuthenticationService as authService } from '../../Services/Auth/AuthenticationService';
import { IJwtPayload } from '../../Interfaces';
import {file, param, request, response} from '../../Core/Routing';
import { Connection } from '../../Config';
import { UserModel } from '../../Models';
import {data} from "../../../Test/Data/data";

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
      return response().status(400).send({
        message: error,
      });
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
      this._client.query('UPDATE users SET avatar = $1 WHERE _id = $2 RETURNING avatar',
        [file()?.filename, userId],
        (error, result) => {
        if (error) return reject(error);
        resolve(result.rows[0]);
        });
    });
  }

  /**
   * Get the user role using the id from the token
   * @param token
   */
  // public static async getUserRole(token: string) {
  //   const { _id } = await this.getUserId(token);
  //   return 'admin';
  // }
}
