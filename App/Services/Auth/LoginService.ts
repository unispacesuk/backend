import {Connection} from "../../Config";
import {Client} from "pg";

interface UserIn {
  username: string,
  not_username: string
}

interface UserOut {
  username: string,
  email: string
}

export class LoginService {

  private static _client: Client = Connection.Client;

  public static findUser(user: UserIn): Promise<UserOut> {
    const {username, not_username} = user;
    return new Promise<UserOut>((resolve, reject) => {
      this._client.query('select * from users where username=$1 and not_username=$2',
        [username, not_username], (error, result) => {
          const response: UserOut = {
            username: result.rows[0].username,
            email: result.rows[0].email
          };
          resolve(response);
        });
    });
  }

}