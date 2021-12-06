import {Connection} from "../../Config";
import {Client} from "pg";
import {compare} from "bcrypt";

import {UserResponse, IUserResponse} from "../../Models/UserModel";

export class LoginService {

  private static _client: Client = Connection.client;

  public static findUser(user: any) {
    const {username, not_username} = user;
    return new Promise<IUserResponse | null>((resolve, reject) => {
      this._client.query('SELECT * FROM users WHERE username=$1',
        [username], (error, result) => {
          if (error) reject(error);
          if (result.rows.length > 0) {
            compare(not_username, result.rows[0].not_username).then((res) => {
              if (res) {
                resolve(UserResponse(result.rows[0]));
              } else {
                resolve(null);
              }
            }).catch(() => resolve(null));
          } else {
            resolve(null);
          }
        });
    });
  }

}