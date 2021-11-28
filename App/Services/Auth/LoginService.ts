import {Connection} from "../../Config";
import {Client} from "pg";

import {UserResponse, IUserResponse} from "../../Models/UserModel";

export class LoginService {

  private static _client: Client = Connection.Client;

  public static findUser(user: any) {
    const {username, not_username} = user;
    return new Promise<IUserResponse | null>((resolve, reject) => {
      this._client.query('select * from users where username=$1 and not_username=$2',
        [username, not_username], (error, result) => {
          if (error) reject(error);
          if (result.rows.length > 0) {
            resolve(UserResponse(result.rows[0]));
          }
          resolve(null);
        });
    });
  }

}