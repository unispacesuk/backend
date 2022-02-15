import { UserService } from '../User/UserService';
import { request, param, query } from '../../Core/Routing';
import { Connection } from '../../Config';
import { Client } from 'pg';
import { IQuestionModel, QuestionModel } from '../../Models/QuestionModel';

interface ICriteria {
  userId?: string;
  orderBy?: string;
  sort?: string;
  page?: number;
  tag?: string;
  keyword?: string;
}

export class QuestionService {
  static conn: Client = Connection.client;

  /**
   * Post / Insert a new question on the database.
   * We will return the question so we can update the frontend with the new question details. 🤔
   */
  public static async postQuestion(): Promise<IQuestionModel> {
    // const _id = await UserService.getUserId(request().token());
    const userId = request().data<string>('userId');
    const { title, description, tags } = request().body();

    return new Promise((resolve, reject) => {
      this.conn.query(
        'INSERT INTO questions (user_id, title, description, tags) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, title, description, tags],
        (error, result) => {
          if (error) return reject(error);
          resolve(QuestionModel(result.rows[0]));
        }
      );
    });
  }

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
   * Get all questions.
   * This method will also run when getting questions relative to a single user.
   */
  public static async getAll(): Promise<IQuestionModel> {
    const values: (string | boolean)[] = []; // empty array for the values to use prepared statement
    let _query = 'SELECT * FROM questions ' +
      'WHERE active=($1)';
    values.push(true);

    const criteria = this.filtering(query());

    if (criteria.userId) {
      values.push(criteria.userId);
      _query += ` AND user_id = $${values.length}`;
    }

    if (criteria.keyword) {
      // values.push(criteria.keyword);
      _query += ` AND title LIKE '%${criteria.keyword}%'`;
      _query += ` OR '${criteria.keyword}'=ANY(tags)`;
      _query += ` OR description LIKE '%${criteria.keyword}%'`;
    }

    if (criteria.tag) {
      values.push(criteria.tag);
      _query += ` AND $${values.length}=ANY(tags)`;
    }

    if (!criteria.orderBy) {
      _query += ' ORDER BY created_at DESC';
    } else {
      values.push(criteria.orderBy);
      _query += ` ORDER BY $${values.length}`;
    }

    !criteria.sort ? ` DESC` : ` ${criteria.sort}`; // set DESC by default if no sort is set

    return new Promise((resolve, reject) => {
      this.conn.query(_query, [...values], (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(<IQuestionModel>result.rows.map((q) => QuestionModel(q)));
      });
    });
  }

  /**
   * Update question
   */
  public static async updateQuestion(): Promise<IQuestionModel> {
    const { _id, title, content } = request().body();
    const userId = <string>await UserService.getUserId(request().token()); // can cast to string :poggers:

    const values: string[] = [];

    let query = 'UPDATE questions SET last_updated = now()';

    if (title) {
      values.push(title);
      query += `,title = $${values.length}`;
    }

    if (content) {
      values.push(content);
      query += `,content = $${values.length}`;
    }

    // values.length-1 because we are adding two items on the array and we want two different indexes
    values.push(_id, userId);
    query += ` WHERE _id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`;
    return new Promise((resolve, reject) => {
      this.conn.query(query, [...values], (error, result) => {
        if (error) return reject(error);
        resolve(QuestionModel(result.rows[0]));
      });
    });
  }

  /**
   * Delete a question.
   * Only admins, mods and the owner will be able to delete.
   * @const id - the id of the question. sent as a parameter on the url.
   *
   * TODO: MAKE SURE THAT THE USER OWNS THE QUESTION OR OVERRIDE IF ADMIN/MOD/STAFF
   */
  public static async deleteQuestion(): Promise<boolean | Error> {
    const { id } = param();
    const userId = request().data('userId');

    return new Promise((resolve, reject) => {
      this.conn.query(
        'DELETE FROM questions WHERE _id = $1 AND user_id = $2',
        [id, userId],
        (error, result) => {
          if (error) return reject(error);
          if (result.rowCount === 0) return resolve(false);
          resolve(true);
        }
      );
    });
  }

  /**
   * Filtering of the request
   * When getAll() is called it can be for all or might have to be filtered (by user for ex.)
   * @private
   */
  private static filtering(options: ICriteria): ICriteria {
    const criteria: ICriteria = {};

    // if a userId is present
    if (param('userId')) {
      criteria.userId = param('userId');
    }

    // if filtering by tag
    // there is a hotfix here. if it breaks I think of another solution quick... should be good anyway
    if (options.tag !== 'undefined') {
      criteria.tag = query<string>('tag');
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

    if (options.keyword) {
      criteria.keyword = options.keyword;
    }

    return criteria;
  }
}
