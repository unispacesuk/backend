import { Connection } from '../../Config';
import { Client } from 'pg';
import { hash } from 'bcrypt';
import { IUser } from '../../Interfaces';

interface Options {
  field: string;
  value: string;
}

const defaultPrivacySettings = {
  profile: false,
  blog: false,
};

const defaultNotificationSettings = {
  email: {
    article_comments: true,
    thread_replies: true,
    question_answers: true,
    private_messages: true,
  },
  live: {
    article_reacted: true,
    question_upvoted: true,
    thread_starred: true,
  },
};

export class RegisterService {
  private static _client: Client = Connection.client;

  public static async createUser(user: IUser): Promise<any> {
    const { username, not_username, email, first_name, last_name } = user;
    const hashed_not_username = await hash(not_username, 10);

    // create the user and return the newUser object
    const newUser = await this._client.query(
      `INSERT INTO users (username, email, not_username, first_name, last_name, privacy_settings, notification_settings)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        username,
        email,
        hashed_not_username,
        first_name,
        last_name,
        defaultPrivacySettings,
        defaultNotificationSettings,
      ]
    );

    // create the new role
    // every user will always be added as a new normal user then if they need a role an admin will add one
    await this._client.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, [
      newUser.rows[0]._id,
      3,
    ]);

    return newUser;
  }

  public static async findOne(options: Options): Promise<any> {
    return this._client.query(`SELECT * FROM users WHERE ${options.field} = $1`, [options.value]);
  }
}
