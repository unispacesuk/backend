import { Client } from 'pg';
import { Connection } from '../../Config';
import { ICategory } from '../../Interfaces';
import { request } from '../../Core/Routing';
import { CategoryModel } from '../../Models';
import { BoardService } from './BoardService';

export class CategoryService {
  static conn: Client = Connection.client;

  public static async addCategory() {
    const userId = request().data<string>('userId');
    const { title, description }: ICategory = request().body<ICategory>();

    return new Promise((resolve, reject) => {
      this.conn.query(
        'INSERT INTO board_categories (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
        [userId, title, description], (error, result) => {
         if (error) reject(error);
         resolve(CategoryModel(result.rows[0]));
        });
    });
  }

  /**
   * Here we fetch the data and we need Promise.all() to wait for the map to finish fetching
   *  data for each category.
   */
  public static async getAllCategories() {
    const { rows } = await this.conn.query('SELECT * FROM board_categories');

    if (rows.length === 0) {
      return Promise.resolve([]);
    }

    return Promise.all(
      rows.map(async (c: ICategory) => {
        c.boards = await BoardService.getAllBoards(c._id);
        return CategoryModel(c);
      })
    );
    // return Promise.resolve(rows.map((c: ICategory) => CategoryModel(c)));
  }

  // public static async getAllCategoriesAndBoards() {
  //   const { rows } = await this.conn.query(
  //     'SELECT ' +
  //       'board_categories._id AS cat_id, ' +
  //       'board_categories.title AS cat_title, ' +
  //       'board_categories.description AS cat_description, ' +
  //       'board_boards.*' +
  //       'FROM board_categories JOIN board_boards ON board_categories._id = board_boards.board_category_id;'
  //   );
  //
  //   return Promise.resolve(rows);
  // }

  /**
   * Check if category exists
   */
  public static async categoryExists(id: number) {
    const { rows } = await this.conn.query('SELECT * FROM board_categories WHERE _id = $1', [id]);
    return Promise.resolve(rows.length);
  }
}
