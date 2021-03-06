import { Connection } from '../../Config';
import { param, request, query } from '../../Core/Routing';
import { BlogModel } from '../../Models/BlogModel';
import { NotificationService } from '../User/NotificationService';

export class BlogService {
  static conn = Connection.client;

  static getAllArticles() {
    const page = query<number>('page');
    const take = query<number>('take'); // comes for the dropdown select from the user in the frontend

    let skip = 0;
    if (page > 1) {
      skip = (page - 1) * take;
    }

    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT blog_posts.*, ' +
          "json_build_object('avatar', users.avatar, 'username', users.username, 'first_name', users.first_name, 'last_name', users.last_name) as user, " +
          'json_agg(DISTINCT blog_votes.*) as votes,' +
          '(SELECT COUNT(*) FROM blog_posts) as count ' +
          'FROM blog_posts ' +
          'LEFT JOIN users ON users._id = blog_posts.user_id ' +
          'LEFT JOIN blog_votes ON blog_votes.blog_id = blog_posts._id ' +
          'GROUP BY blog_posts._id, users.avatar, users.username, users.first_name, users.last_name ' +
          'ORDER BY created_at DESC ' +
          'OFFSET $1 LIMIT $2',
        [skip, take],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result.rows.map((b) => BlogModel(b)));
        }
      );
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
          return resolve(result.rows[0]);
        }
      );
    });
  }

  static getSingleArticle() {
    const articleId = param('articleId');

    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT blog_posts.*, ' +
          "jsonb_build_object('avatar', users.avatar, 'username', users.username, 'first_name', users.first_name, 'last_name', users.last_name) as user, " +
          'jsonb_agg(DISTINCT blog_votes.*) as votes, ' +
          "jsonb_agg(DISTINCT jsonb_build_object('comment', blog_comments.*, 'avatar', commenter.avatar, 'username', commenter.username)) as comments " +
          'FROM blog_posts ' +
          'LEFT JOIN users ON users._id = blog_posts.user_id ' +
          'LEFT OUTER JOIN blog_votes ON blog_votes.blog_id = $1 ' +
          'LEFT OUTER JOIN blog_comments ON blog_comments.blog_post = $1 ' +
          'LEFT OUTER JOIN users commenter ON commenter._id = blog_comments.user_id ' +
          'WHERE blog_posts._id = $1 ' +
          'GROUP BY blog_posts._id, users.avatar, users.username, users.first_name, users.last_name',
        [articleId],
        (error, result) => {
          if (error) return reject(error);
          return resolve(BlogModel(result.rows[0]));
        }
      );
    });
  }

  static updateBlogArticle(): Promise<void> {
    const articleId = param('articleId');
    const { title, content } = request().body();

    return new Promise((resolve, reject) => {
      this.conn.query(
        'UPDATE blog_posts SET title = $1, content = $2, last_updated = now() WHERE _id = $3',
        [title, content, articleId],
        (error) => {
          if (error) return reject(error);
          return resolve();
        }
      );
    });
  }

  static deleteBlogArticle(): Promise<void> {
    const articleId = param('articleId');

    return new Promise((resolve, reject) => {
      this.conn.query('DELETE FROM blog_posts WHERE _id = $1', [articleId], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  static insertNewVote(): Promise<void> {
    const articleId = param('articleId');
    const userId = request().data('userId');
    const { voteType } = request().body();

    NotificationService.addBlogVoteNotification(<number>articleId, <number>userId);

    return new Promise((resolve, reject) => {
      this.conn.query(
        'INSERT INTO blog_votes VALUES ($1, $2, $3)',
        [articleId, userId, voteType],
        (error) => {
          if (error) return reject(error);
          return resolve();
        }
      );
    });
  }

  static insertNewComment(): Promise<void> {
    const articleId = param('articleId');
    const userId = request().data('userId');
    const { content } = request().body();

    return new Promise((resolve, reject) => {
      this.conn.query(
        'INSERT INTO blog_comments (user_id, blog_post, content) VALUES ($1, $2, $3) ' +
          'RETURNING *',
        [userId, articleId, content],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result.rows[0]);
        }
      );
    });
  }

  static getRecentActivity() {
    const articleId = param('articleId');

    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT DISTINCT ON (blog_comments.user_id) blog_comments._id, ' +
          'users.username, users.avatar ' +
          'FROM blog_comments ' +
          'LEFT OUTER JOIN users ON users._id = blog_comments.user_id ' +
          'WHERE blog_comments.blog_post = $1 ' +
          'ORDER BY blog_comments.user_id, blog_comments._id DESC ' +
          'LIMIT 5',
        [articleId],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result.rows);
        }
      );
    });
  }
}
