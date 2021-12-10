import { Connection } from '../../Config';
import { Client } from 'pg';
import { hash } from 'bcrypt';

export class RegisterService {
  private static _client: Client = Connection.client;

  /*
  TODO: CHECKS FOR USERNAME AND EMAIL
   */

  public static async createUser(user: any) {
    const { username, not_username, email, first_name, last_name } = user;
    const hashed_not_username = await hash(not_username, 10);
    return new Promise<any>((resolve, reject) => {
      this._client.query(
        'INSERT INTO users (username, email, not_username, first_name, last_name) VALUES ($1, $2, $3, $4, $5)',
        [username, email, hashed_not_username, first_name, last_name],
        (error) => {
          if (error) reject(error);
          resolve('user added');
        }
      );
    });
  }
}
