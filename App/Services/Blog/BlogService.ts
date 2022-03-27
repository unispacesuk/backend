import { Connection } from '../../Config';
import { param, request } from '../../Core/Routing';

export class BlogService {
  static conn = Connection.client;

  static getAllArticles() {
    return new Promise((resolve, reject) => {
      this.conn.query('SELECT * FROM blog_posts ORDER BY created_at DESC ', [], (error, result) => {
        if (error) return reject(error);
        resolve(result.rows);
      });
    });
  }

  static createNewArticle() {
    const userId = request().data('userId');
    const { title, content } = request().body();

    return new Promise((resolve, reject) => {
      this.conn.query(
        'INSERT INTO blog_posts (user_id, title, content) VALUES ($1, $2, $3) ' + 'RETURNING *',
        [userId, title, content],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.rows[0]);
        }
      );
    });
  }

  static getSingleArticle() {
    const articleId = param('articleId');

    return new Promise((resolve, reject) => {
      this.conn.query('SELECT * FROM blog_posts WHERE _id = $1', [articleId], (error, result) => {
        if (error) return reject(error);
        resolve(result.rows[0]);
      });
    });
  }
}
