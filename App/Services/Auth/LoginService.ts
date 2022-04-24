import { Connection } from '../../Config';
import { Client } from 'pg';
import { compare, hash } from 'bcrypt';

import { UserModel } from '../../Models';
import { IUser } from '../../Interfaces';

export class LoginService {
  private static _client: Client = Connection.client;

  // TODO: REFACTOR THIS SHIT CODE
  public static findUser(user: IUser) {
    const { username, not_username } = user;
    return new Promise((resolve, reject) => {
      this._client.query(
        'SELECT * FROM users LEFT JOIN user_roles r on users._id = r.user_id WHERE users.username=$1',
        [username],
        (error, result) => {
          if (error) reject(error);
          if (result.rows.length > 0) {
            compare(not_username, result.rows[0].not_username)
              .then(async (res) => {
                if (res) {
                  await this.setLastLogin(result.rows[0]._id);
                  resolve(UserModel(result.rows[0]));
                } else {
                  resolve(null);
                }
              })
              .catch(() => resolve(null));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static async getUserData(id: string) {
    return new Promise((resolve, reject) => {
      this._client.query(
        'SELECT * FROM users LEFT JOIN user_roles r on users._id = r.user_id WHERE users._id = $1',
        [id],
        (error, result) => {
          if (error) return reject(error);
          if (result.rows.length === 0) {
            return reject('No user found!');
          }
          resolve(UserModel(result.rows[0]));
        }
      );
    });
  }

  private static async setLastLogin(id: number) {
    return new Promise((resolve, reject) => {
      this._client.query(`UPDATE users SET last_login = 'now()' where _id = $1`, [id], (error) => {
        if (error) return reject(error);
        return resolve(true);
      });
    });
  }
}
