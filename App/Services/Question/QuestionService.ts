import { UserService } from '@Services/User/UserService';
import { request } from '@Requests';
import { Connection } from '../../Config';
import { Client } from 'pg';

export class QuestionService {
  static conn: Client = Connection.client;

  public static async getQuestion(id: string): Promise<any> {
    return 'hi';
  }

  public static async postQuestion(): Promise<any> {
    const _id = await UserService.getUserId(request().token);
    const { title, content } = request().body;

    return new Promise((resolve, reject) => {
      this.conn.query(
        `INSERT INTO questions (user_id, title, content)
        VALUES ($1, $2, $3) RETURNING _id`,
        [_id, title, content],
        (error, result) => {
          if (error) reject(error);
          resolve(result.rows[0]);
        }
      );
    });
  }

  public static async deleteQuestion(): Promise<any> {
    const {id} = request().parameters;
    console.log(id);
  }
}
