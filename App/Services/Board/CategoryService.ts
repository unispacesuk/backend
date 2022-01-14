import { Client } from 'pg';
import { Connection } from '../../Config';
import { ICategory } from '../../Interfaces/ICategory';
import { request } from '../../Core/Routing';
import { CategoryModel } from '../../Models/CategoryModel';

export class CategoryService {
  static conn: Client = Connection.client;

  public static async addCategory() {
    const userId = request().data<string>('userId');
    const { title, description }: ICategory = request().body<ICategory>();

    const { rows } = await this.conn.query(
      'INSERT INTO board_categories (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, description]
    );

    // if for some reason the db does not return anything we do not want this to break
    if (rows.length > 0)
      return Promise.resolve(CategoryModel(rows[0]));
  }

  public static async getAllCategories() {
    const { rows } = await this.conn.query('SELECT * FROM board_categories');

    if (rows.length === 0) {
      return Promise.resolve([]);
    }

    return Promise.resolve(rows.map((c) => CategoryModel(c)));
  }
}
