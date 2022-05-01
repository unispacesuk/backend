import { AuthenticationService as authService } from '../../Services/Auth/AuthenticationService';
import { IJwtPayload, UserRole } from '../../Interfaces';
import { file, param, request, respond } from '../../Core/Routing';
import { Connection } from '../../Config';
import { UserModel } from '../../Models';
import { compareHash, hashPassword } from '../Util/Hash';
import { NotificationSettingsModel } from '../../Models/NotificationSettingsModel';

export class UserService {
  private static client = Connection.client;

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
    const username = param('username');

    return new Promise((resolve, reject) => {
      this.client.query('SELECT * FROM users WHERE username = $1', [username], (error, result) => {
        if (error) return reject(error);
        if (!result.rows.length) return resolve(null);
        resolve(UserModel(result.rows[0]));
      });
    });
  }

  public static async setUserAvatar() {
    const userId = request().data('userId');

    return new Promise((resolve, reject) => {
      this.client.query(
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
      this.client.query(
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
      this.client.query(
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
      this.client.query(
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
      this.client.query(
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

    const user = await this.client.query('SELECT not_username FROM users WHERE _id = $1', [userId]);

    return await compareHash(currentPassword, user.rows[0].not_username);
  }

  public static doPasswordsMatch() {
    const { newPassword, newPasswordConfirm } = request().body();

    return newPassword === newPasswordConfirm;
  }

  public static setUserStatus(userId: number, status: boolean) {
    return new Promise((resolve, reject) => {
      this.client.query(
        'UPDATE users SET is_online = $1 WHERE _id = $2',
        [status, userId],
        (error) => {
          if (error) return reject(error);
          resolve(true);
        }
      );
    });
  }

  public static updateUserPrivacySettings() {
    const userId = request().data('userId');
    const { type, value } = request().body();

    return new Promise((resolve, reject) => {
      this.client.query(
        `
      UPDATE users
      SET privacy_settings = jsonb_set(privacy_settings, '{${type}}', '${value}')
      WHERE _id = $1;
      `,
        [userId],
        (error) => {
          if (error) return reject(error);
          resolve(null);
        }
      );
    });
  }

  // I want to use this method in various places...
  // then I pass the userId as an argument...
  // allows me to fetch not. settings for a specific user to then send email / live notification or not
  public static getUserNotificationSettings(userId: number) {
    return new Promise((resolve, reject) => {
      this.client.query(
        'SELECT notification_settings FROM users WHERE _id = $1',
        [userId],
        (error, result) => {
          if (error) return reject(error);
          resolve(NotificationSettingsModel(result.rows[0].notification_settings));
        }
      );
    });
  }

  // now here... should I update 1 by 1 or update all at once?
  // 1 by one when the user changes the toggle should be fine for now...
  // but can be a bottleneck if too many users are changing their settings at once...
  // we keep an eye on this...
  public static async updateUserNotificationSettings() {
    const userId = request().data('userId');
    const { type, setting, value } = request().body();

    return new Promise((resolve, reject) => {
      this.client.query(
        `
        UPDATE users
        SET notification_settings = jsonb_set(notification_settings, '{${type}, ${setting}}', '${value}')
        WHERE _id = $1
        `,
        [userId],
        (error) => {
          if (error) return reject(error);
          resolve(true);
        }
      );
    });
  }

  public static async setLastUpdated() {
    const userId = request().data('userId');

    return new Promise((resolve, reject) => {
      this.client.query(
        `UPDATE users
        SET last_updated = 'now()'
        WHERE _id = $1`,
        [userId],
        (error) => {
          if (error) return reject(error);
          return resolve(true);
        }
      );
    });
  }

  public static async isUserAdmin(): Promise<any> {
    const userId = request().data('userId');

    return new Promise((resolve, reject) => {
      this.client.query(
        'SELECT role_id FROM user_roles WHERE user_id = $1',
        [userId],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result.rows[0]);
        }
      );
    });
  }

  public static async searchUser() {
    const { username } = param();

    const value = '%' + username + '%';
    const result = await this.client.query(
      'SELECT _id, username, first_name, last_name, avatar FROM users WHERE ' +
        `username LIKE $1 OR lower(concat(first_name, ' ', last_name)) LIKE $1`,
      [value]
    );

    return Promise.resolve(result.rows);
  }

  public static async getUserDataById(id: number) {
    const user = await this.client.query(
      'SELECT _id, username, avatar, is_online FROM users WHERE _id = $1',
      [id]
    );

    if (!user.rows.length) {
      return Promise.resolve(null);
    }

    return Promise.resolve(user.rows[0]);
  }
}
