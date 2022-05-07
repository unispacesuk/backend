import { Connection } from '../../Config';
import { param } from '../../Core/Routing';

export class StatisticsService {
  static conn = Connection.client;

  /**
   * Boards count
   * Threads count
   * Replies count
   * ^^ all based on the category id not the other way around
   */
  static getCategoryStats() {
    const { category } = param();

    return new Promise((resolve, reject) => {
      this.conn.query(
        'with boards as (select * from board_boards where board_category_id = $1), ' +
          'threads as (select * from board_threads), ' +
          'replies as (select * from board_thread_replies) ' +
          'select count(DISTINCT boards.*) as board_count, ' +
          'count(DISTINCT threads.*) as thread_count, ' +
          'count(DISTINCT replies.*) as reply_count ' +
          'from boards ' +
          'left outer join threads on threads.board_boards_id = boards._id ' +
          'left outer join replies on replies.board_thread_id = threads._id',
        [category],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result.rows);
        }
      );
    });
  }
}
