import { Connection } from '../../Config';
import { Client } from 'pg';
import { compare } from 'bcrypt';

import { UserModel } from '../../Models';
import { IUser } from '../../Interfaces';

export class LoginService {
  private static _client: Client = Connection.client;

  // TODO: REFACTOR THIS SHIT CODE
  public static findUser(user: IUser) {
    const { username, not_username } = user;
    return new Promise((resolve, reject) => {
      this._client.query('SELECT * FROM users WHERE username=$1', [username], (error, result) => {
        if (error) reject(error);
        if (result.rows.length > 0) {
          compare(not_username, result.rows[0].not_username)
            .then((res) => {
              if (res) {
                resolve(UserModel(result.rows[0]));
              } else {
                resolve(null);
              }
            })
            .catch(() => resolve(null));
        } else {
          resolve(null);
        }
      });
    });
  }

  static async getUserData(id: string) {
    return new Promise((resolve, reject) => {
      this._client.query('SELECT * FROM users WHERE _id = $1', [id], (error, result) => {
        if (error) return reject(error);
        resolve(UserModel(result.rows[0]));
      });
    });
  }
}
