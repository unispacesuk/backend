import { UserService } from '@Services/User/UserService';
import { request } from '@Requests';
import { Connection } from '../../Config';
import { Client } from 'pg';
import { IQuestionModel, QuestionModel } from '../../Models/QuestionModel';

interface ICriteria {
  userId?: string;
  orderBy?: string;
  sort?: string;
}

export class QuestionService {
  static conn: Client = Connection.client;

  /**
   * Fetch a single question from the database using its id.
   * @param id
   */
  public static async getQuestion(id: string): Promise<IQuestionModel | []> {
    return new Promise((resolve, reject) => {
      this.conn.query('SELECT * FROM questions WHERE _id = $1', [id], (error, result) => {
        if (error) return reject(error);
        if (result.rows.length === 0) return resolve([]);
        resolve(QuestionModel(result.rows[0]));
      });
    });
  }

  /**
   * Post / Insert a new question on the database.
   * We will return the question so we can update the frontend with the new question details. 🤔
   */
  public static async postQuestion(): Promise<IQuestionModel> {
    const _id = await UserService.getUserId(request().token);
    const { title, content } = request().body;

    return new Promise((resolve, reject) => {
      this.conn.query(
        'INSERT INTO questions (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
        [_id, title, content],
        (error, result) => {
          if (error) return reject(error);
          resolve(QuestionModel(result.rows[0]));
        }
      );
    });
  }

  /**
   * Get all questions.
   * This method will also run when getting questions relative to a single user.
   */
  public static async getAll(): Promise<IQuestionModel> {
    const values: string[] = []; // empty array for the values to use prepared statement
    let query = 'SELECT * FROM questions ';

    const criteria = this.filtering(request().query);

    if (criteria.userId) {
      values.push(criteria.userId);
      query += ` WHERE user_id = $${values.length}`;
    }

    if (!criteria.orderBy) {
      query += ' ORDER BY created_at DESC';
    } else {
      values.push(criteria.orderBy);
      query += ` ORDER BY $${values.length}`;
    }

    !criteria.sort ? ` DESC` : ` ${criteria.sort}`; // set DESC by default if no sort is set

    return new Promise((resolve, reject) => {
      this.conn.query(query, [...values], (error, result) => {
        if (error) return reject(error);
        resolve(<IQuestionModel>result.rows.map((q) => QuestionModel(q)));
      });
    });
  }

  /**
   * Delete a question.
   * Only admins, mods and the owner will be able to delete.
   * @const id - the id of the question. sent as a parameter on the url.
   */
  public static async deleteQuestion(): Promise<any> {
    const { id } = request().parameters;
    console.log(id);
  }

  /**
   * Filtering of the request
   * When getAll() is called it can be for all or might have to be filtered (by user for ex.)
   * @private
   */
  private static filtering(options: ICriteria): ICriteria {
    const criteria: ICriteria = {};

    // if a userId is present
    if (request().parameters.userId) {
      criteria.userId = request().parameters.userId;
    }

    // if sortBy is present
    // sort by created_at will be default
    if (options.orderBy) {
      criteria.orderBy = options.orderBy;
    }

    // if order is present
    // desc will be default
    if (options.sort) {
      criteria.sort = options.sort;
    }

    return criteria;
  }
}
