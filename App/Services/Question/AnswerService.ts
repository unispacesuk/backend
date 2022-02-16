import { param, request } from '../../Core/Routing';
import { Connection } from '../../Config';
import { AnswerModel } from '../../Models';

export class AnswerService {
  static conn = Connection.client;

  /**
   * Add an answer to the question
   */
  public static async addAnswer(): Promise<any> {
    const userId = request().data<number>('userId');
    const { id } = param();
    const { content } = request().body();

    let newQuestionId;
    return new Promise((resolve, reject) => {
      this.conn.query(
        'INSERT INTO answers (user_id, question_id, content) VALUES ($1, $2, $3) RETURNING _id',
        [userId, id, content], (error, result) => {
          if (error) return reject(error);
          newQuestionId = result.rows[0]._id;
          this.conn.query('SELECT answers.*, users.username, users.avatar FROM users, answers LEFT JOIN users u on u._id = answers.user_id WHERE answers._id = $1', [newQuestionId], (error, result) => {
            if (error) return reject(error);
            resolve(AnswerModel(result.rows[0]));
          });
        }
      );
    });
  }

  /**
   * Get all answers of a question
   */
  public static async getAnswers(): Promise<any> {
    const { id } = param();
    return new Promise((resolve, reject) => {
      this.conn.query('SELECT answers.*, users.username, users.avatar FROM users, answers LEFT JOIN users u on u._id = answers.user_id WHERE answers.question_id = $1 ORDER BY answers.created_at DESC',
        [id], (error, result) => {
        if (error) return reject(error);
        resolve(result.rows.map((a) => AnswerModel(a)));
      });
    });
  }
}
