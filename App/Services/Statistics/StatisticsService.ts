import { Connection } from '../../Config';
import { CategoryModel } from '../../Models';

export class StatisticsService {
  static conn = Connection.client;

  /**
   * Boards count
   * Threads count
   * Replies count
   * ^^ all based on the category id not the other way around
   * TODO: Refactor the below qyery to satisfy the above
   */
  static getCategoryStats(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(
        'WITH boards AS (SELECT board_boards.* FROM board_boards), ' +
          'threads AS (SELECT board_threads.* FROM board_threads), ' +
          'replies AS (SELECT board_thread_replies.* FROM board_thread_replies) ' +
          'SELECT board_categories.*, ' +
          'COUNT(distinct boards.*) AS board_count, ' +
          'COUNT(distinct threads.*) AS thread_count, ' +
          'COUNT(distinct replies.*) AS reply_count ' +
          'FROM board_categories, boards, threads, replies ' +
          'WHERE board_categories._id = boards.board_category_id ' +
          'AND boards._id = threads.board_boards_id ' +
          'AND threads._id = replies.board_thread_id ' +
          'GROUP BY board_categories._id',
        [],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result.rows.map((r) => CategoryModel(r)));
        }
      );
    });
  }

  // TODO: These stats below
  static async getTotalUsers() {}

  static async getTotalThreads() {}

  static async getTotalReplies() {}

  static async getTotalBlogArticles() {}

  static async getTotalQuestions() {}
}
