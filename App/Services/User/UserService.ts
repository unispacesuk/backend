import { AuthenticationService as authService } from '../../Services/Auth/AuthenticationService';
import { IJwtPayload, UserRole } from '../../Interfaces';
import { file, param, request, respond } from '../../Core/Routing';
import { Connection } from '../../Config';
import { UserModel } from '../../Models';
import { compareHash, hashPassword } from '../Util/Hash';

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

  /**
   * Get current users starred threads
   * TODO: is this good here or should be on Board/Thread services?
   */
  public static async getStarredThreads() {
    const userId = request().data('userId');

    return new Promise((resolve, reject) => {
      this._client.query(
        'SELECT board_threads.* ' +
          'FROM board_threads_stars ' +
          'JOIN board_threads ' +
          'ON board_threads_stars.thread_id = board_threads._id ' +
          'WHERE board_threads_stars.user_id = $1',
        [userId],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.rows);
        }
      );
    });
  }

  public static async updateUserProfile() {
    const userId = request().data('userId');
    const { username, email, firstName, lastName } = request().body();

    return new Promise((resolve, reject) => {
      this._client.query(
        'UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4 WHERE _id = $5',
        [username, email, firstName, lastName, userId],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.rows[0]);
        }
      );
    });
  }

  public static async updateUserPassword() {
    const userId = request().data('userId');
    const { newPasswordConfirm } = request().body();

    const digest = await hashPassword(newPasswordConfirm);

    return new Promise((resolve, reject) => {
      this._client.query(
        'UPDATE users SET not_username = $1 WHERE _id = $2',
        [digest, userId],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.rows[0]);
        }
      );
    });
  }

  public static async isValidPassword() {
    const userId = request().data('userId');
    const { currentPassword } = request().body();

    const user = await this._client.query('SELECT not_username FROM users WHERE _id = $1', [
      userId,
    ]);

    return await compareHash(currentPassword, user.rows[0].not_username);
  }

  public static doPasswordsMatch() {
    const { newPassword, newPasswordConfirm } = request().body();

    return newPassword === newPasswordConfirm;
  }
}
