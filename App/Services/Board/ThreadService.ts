import { Connection } from '../../Config';
import { ThreadModel } from '../../Models';
import { IThread } from '../../Interfaces/IThread';
import { param, request } from '../../Core/Routing';
import { ThreadReplyModel } from '../../Models/ThreadRreplyModel';

export class ThreadService {
  static conn = Connection.client;

  /**
   * Get a Thread
   * TODO: Refactor to get the any out
   */
  static getThread(): Promise<any> {
    const threadId: number = param<number>('thread');
    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT threads.*, users.avatar, users.username, ' +
          'COUNT(thread_stars.thread_id) as stars ' +
          'FROM board_threads as threads ' +
          'JOIN users ON users._id = threads.user_id ' +
          'LEFT OUTER JOIN board_threads_stars as thread_stars ON thread_stars.thread_id = $1' + // here can be $1 (threadId) or just threads._id
          'WHERE threads._id = $1 ' +
          'GROUP BY threads._id, users.avatar, users.username',
        [threadId],
        (error, result) => {
          if (error) return reject(error);
          if (result.rows.length > 0) {
            return resolve(ThreadModel(result.rows[0]));
          }
          resolve(0);
        }
      );
    });
  }

  /**
   * Create a new thread
   */
  static async createNewThread() {
    const body: IThread = request().body();
    const userId = request().data<number>('userId');
    return new Promise((resolve, reject) => {
      this.conn.query(
        'WITH newThread AS (INSERT INTO board_threads (user_id, board_boards_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *) ' +
          'SELECT newThread.*, users.username FROM newThread LEFT JOIN users ON newThread.user_id = users._id',
        [userId, body.board, body.title, body.content],
        (error, result) => {
          if (error) return reject(error);
          resolve(ThreadModel(result.rows[0]));
        }
      );
    });
  }

  /**
   * Get all threads from board
   *
   * TODO: Pagination
   */
  static async getAllThreads(id: number) {
    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT board_threads.*, board_boards.title as board_title, board_boards.board_category_id, ' +
          'users.username, users.avatar, board_categories.title as cat_title, COUNT(board_threads_stars.thread_id) as stars ' +
          'FROM board_threads ' +
          'LEFT JOIN users ' +
          'ON board_threads.user_id = users._id ' +
          'LEFT JOIN board_boards ' +
          'ON board_boards._id = $1 ' +
          'LEFT JOIN board_categories ' +
          'ON board_categories._id = board_boards.board_category_id ' +
          'LEFT JOIN board_threads_stars ' +
          'ON board_threads_stars.thread_id = board_threads._id ' +
          'WHERE board_threads.board_boards_id = $1 ' +
          'GROUP BY board_threads._id, board_title, board_boards.board_category_id, users.username, users.avatar, board_categories.title ' +
          'ORDER BY created_at DESC',
        [id],
        (error, result) => {
          if (error) return reject(error);
          if (result.rows.length === 0) return resolve(0);
          resolve(result.rows.map((t) => ThreadModel(t)));
        }
      );
    });
  }

  /**
   * Delete a thread
   */
  static async deleteThread() {
    const threadId = param<number>('threadId');

    return new Promise<void>((resolve, reject) => {
      this.conn.query('DELETE FROM board_threads WHERE _id = $1', [threadId], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  /**
   * Add a thread reply
   */
  static async addNewReply() {
    const threadId = param<number>('thread');
    const userId = request().data<number>('userId');
    const { content } = request().body();

    return new Promise((resolve, reject) => {
      this.conn.query(
        'WITH new_reply AS (' +
          'INSERT INTO board_thread_replies (user_id, board_thread_id, content) ' +
          'VALUES ($1, $2, $3) RETURNING *) ' +
          'SELECT new_reply.*, users.username, users.avatar ' +
          'FROM users, new_reply ' +
          'WHERE users._id = $1',
        [userId, threadId, content],
        (error, result) => {
          if (error) return reject(error);
          if (result.rows && result.rows.length > 0) {
            return resolve(ThreadReplyModel(result.rows[0]));
          }
          resolve(null);
        }
      );
    });
  }

  /**
   * Get all replies from thread
   */
  static async getAllReplies() {
    const threadId = param<number>('thread');

    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT replies.*, users.username, users.avatar ' +
          'FROM board_thread_replies as replies ' +
          'JOIN users ON replies.user_id = users._id ' +
          'WHERE board_thread_id = $1',
        [threadId],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.rows.map((tr) => ThreadReplyModel(tr)));
        }
      );
    });
  }

  /**
   * Update a thread
   */
  static async updateThread() {
    const threadId = param('thread');
    const { title, content } = request().body();

    const values: any[] = [];
    let query = 'UPDATE board_threads SET';

    if (title && title !== '') {
      values.push(title);
      query += ` title = $${values.length}, `;
    }

    if (content && content !== '') {
      values.push(content);
      query += ` content = $${values.length}, `;
    }

    values.push(threadId);
    query += `last_updated = now() WHERE _id = $${values.length}`;

    return new Promise((resolve, reject) => {
      this.conn.query(query, [...values], (error) => {
        if (error) return reject(error);
        resolve(true);
      });
    });
  }

  /**
   * Edit a reply
   */
  static async editReply() {}

  /**
   * Delete a reply
   */
  static async deleteReply() {}

  /**
   * Mark thread favourite
   */
  static async starThread(threadId: number, userId: any) {
    return new Promise((resolve, reject) => {
      this.conn.query(
        'INSERT INTO board_threads_stars (user_id, thread_id) ' +
          'SELECT $1, $2 ' +
          'WHERE NOT EXISTS (' +
          'SELECT user_id, thread_id FROM board_threads_stars WHERE user_id = $1 AND thread_id = $2 ' +
          ') RETURNING *',
        [userId, threadId],
        (error, result) => {
          if (error) return reject(error);
          if (result.rows.length === 0) return resolve(false);
          resolve(true);
        }
      );
    });
  }

  static async unstarThread(threadId: number, userId: any) {
    return new Promise((resolve, reject) => {
      this.conn.query(
        'DELETE FROM board_threads_stars WHERE user_id = $1 AND thread_id = $2',
        [userId, threadId],
        (error) => {
          if (error) return reject(error);
          resolve(null);
        }
      );
    });
  }

  /**
   * Check if current thread is starred by user
   */
  static async getStarredState() {
    const threadId = param<number>('thread');
    const userId = request().data<number>('userId');

    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT COUNT(*) FROM board_threads_stars ' + 'WHERE user_id = $1 AND thread_id = $2',
        [userId, threadId],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.rows[0].count > 0);
        }
      );
    });
  }
}
