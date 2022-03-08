import { Connection } from '../../Config';
import { ThreadModel } from '../../Models';
import { IThread } from '../../Interfaces/IThread';
import { param, request } from '../../Core/Routing';

export class ThreadService {
  static conn = Connection.client;

  /**
   * Get a Thread
   * TODO: Refactor to get the any out
   */
  static getThread(): Promise<any> {
    const id: number = param<number>('id');
    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT threads.*, users.avatar, users.username FROM board_threads as threads JOIN users ON users._id = threads.user_id WHERE threads._id = $1',
        [id],
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
   */
  static async getAllThreads(id: number) {
    return new Promise((resolve, reject) => {
      this.conn.query(
        // 'SELECT board_threads FROM board_threads WHERE board_threads.board_boards_id = $1',
        'SELECT board_threads.*, users.username ' +
          'FROM board_threads ' +
          'LEFT JOIN users ' +
          'ON board_threads.user_id = users._id ' +
          'WHERE board_threads.board_boards_id = $1 ' +
          'ORDER BY created_at DESC',
        [id],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.rows.map((t) => ThreadModel(t)));
        }
      );
    });
  }

  /**
   * Delete a thread
   */
  static async deleteThread() {
    const id = param<number>('id');

    return new Promise<void>((resolve, reject) => {
      this.conn.query('DELETE FROM board_threads WHERE _id = $1', [id], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  /**
   * Add a thread reply
   */
  static async addNewReply() {}

  /**
   * Get all replies from thread
   */
  static async getAllReplies() {}

  /**
   * Edit a thread
   */
  static async editThread() {}

  /**
   * Edit a reply
   */
  static async editReply() {}

  /**
   * Delete a reply
   */
  static async deleteReply() {}
}
