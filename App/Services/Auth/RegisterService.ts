import {Connection} from '../../Config';
import {Client} from 'pg';
import {hash} from 'bcrypt';

export class RegisterService {

  private static _client: Client = Connection.Client;

  /**
   * Register the user to the database
   * @param user
   */
  public static async saveUser(user: any) {
    const {username, not_username, email} = user;
    const hashed_not_username = await hash(not_username, 10);

    return new Promise((resolve, reject) => {
      this._client.query('INSERT INTO users (username, email, not_username) VALUES ($1, $2, $3)',
        [username, email, hashed_not_username], (error) => {
          if (error) reject(error);
          resolve('user added');
        });
    });
  }

  /**
   * Check whether the email or username is already registered
   * @param field
   * @param value
   * @private
   */
  public static async userExists(field: string, value: string) {
    return new Promise((resolve, reject) => {
      this._client.query(`SELECT count(*) FROM users WHERE ${field}=$1`,
        [value], (error, result) => {
           if (error) return reject(error);
           resolve(result.rows[0].count > 0);
        });
    });
  }

}