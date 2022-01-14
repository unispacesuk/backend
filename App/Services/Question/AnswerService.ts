import { param, request } from '../../Core/Routing';
import { Connection } from '../../Config';
import { IAnswer } from '../../Interfaces/IAnswer';
import { AnswerModel } from '../../Models/AnswerModel';

export class AnswerService {
  static conn = Connection.client;

  /**
   * Add an answer to the question
   */
  public static async addAnswer(): Promise<boolean> {
    const userId = request().data<number>('userId');
    const { id } = param();
    const { content } = request().body();
    await this.conn.query(
      'INSERT INTO answers (user_id, question_id, content) VALUES ($1, $2, $3)',
      [userId, id, content]
    );

    return Promise.resolve(true);
  }

  /**
   * Get all answers of a question
   */
  public static async getAnswers(): Promise<any> {
    const { id } = param();
    return new Promise((resolve, reject) => {
      this.conn.query('SELECT * FROM answers WHERE question_id = $1', [id], (error, result) => {
        if (error) return reject(error);
        resolve(result.rows.map((a) => AnswerModel(a)));
      });
    });
  }
}
