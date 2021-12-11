import { Connection } from '../../Config';
import { Client } from 'pg';
import { hash } from 'bcrypt';
import { UserInterface } from '../../Interfaces/UserInterface';

interface Options {
  field: string;
  value: string;
}

export class RegisterService {
  private static _client: Client = Connection.client;

  /*
  TODO: CHECKS FOR USERNAME AND EMAIL
   */

  public static async createUser(user: UserInterface): Promise<any> {
    const { username, not_username, email, first_name, last_name } = user;
    const hashed_not_username = await hash(not_username, 10);

    return this._client.query(
      `INSERT INTO users (username, email, not_username, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5) RETURNING username`,
      [username, email, hashed_not_username, first_name, last_name]);
  }

  public static async findOne(options: Options): Promise<any> {
    return this._client.query(`SELECT * FROM users WHERE ${options.field} = $1`, [options.value]);
  }
}
