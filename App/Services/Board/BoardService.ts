import { Connection } from '../../Config';
import { param, request, respond } from '../../Core/Routing';
import { BoardModel } from '../../Models/BoardModel';
import { CategoryService } from './CategoryService';
import { IBoard } from '../../Interfaces';

interface Body {
  title: string;
  description: string;
  category: number;
}

// temp
interface BoardData {
  boardTitle: string;
  catTitle: string;
}

function BoardDataModel(data: any): BoardData {
  return {
    boardTitle: data.board_title,
    catTitle: data.cat_title,
  };
}

// TODO: any to be IBoard

export class BoardService {
  static conn = Connection.client;

  /**
   * Create a new board
   */
  public static async createNewBoard() {
    const userId = request().data<string>('userId');
    const { title, description, category } = request().body<Body>();

    if ((await CategoryService.categoryExists(category)) === 0) {
      return respond({ error: 'cat does not exist' }, 401);
    }

    const { rows } = await this.conn.query(
      'INSERT INTO board_boards (user_id, board_category_id, title, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, category, title, description]
    );
    return Promise.resolve(BoardModel(rows[0]));
  }

  /**
   * Fetch all boards from a category
   */
  public static async getAllBoards(category: number): Promise<any> {
    // const { category } = param();
    //
    if ((await CategoryService.categoryExists(category)) === 0) {
      return respond({ error: 'cat does not exist' }, 401);
    }

    // const { rows } = await this.conn.query(
    //   'SELECT * FROM board_boards WHERE board_category_id = $1',
    //   [category]
    // );

    // return Promise.all(
    //   rows.map(async (b: IBoard) => {
    //     b.threads = await this.getCountOfThreads(b._id);
    //     return BoardModel(b);
    //   })
    // );

    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT board_boards.*, COUNT(DISTINCT board_threads.*) as threads, COUNT(DISTINCT board_thread_replies.*) as replies ' +
          'FROM board_boards ' +
          'LEFT OUTER JOIN board_threads ' +
          'ON board_threads.board_boards_id = board_boards._id ' +
          'LEFT OUTER JOIN board_thread_replies ' +
          'ON board_thread_replies.board_thread_id = board_threads._id ' +
          'WHERE board_category_id = $1 ' +
          'GROUP BY board_boards._id',
        [category],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.rows.map((b) => BoardModel(b)));
        }
      );
    });
  }

  public static async editBoard(): Promise<any> {
    const board: number = param('board');
    const { title, description } = request().body();

    console.log(title, description);

    return new Promise((resolve, reject) => {
      this.conn.query(
        'UPDATE board_boards SET title = $1, description = $2 WHERE _id = $3 RETURNING *',
        [title, description, board],
        (error, result) => {
          if (error) return reject(error);
          if (result.rows.length > 0) {
            resolve(BoardModel(result.rows[0]));
          }
        }
      );
    });
  }

  public static async deleteBoard(): Promise<void> {
    const board: number = param('board');

    return new Promise((resolve, reject) => {
      this.conn.query('DELETE FROM board_boards WHERE _id = $1', [board], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  public static async getBoardData(id: string) {
    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT board_categories.title as cat_title, board_boards.title as board_title FROM board_boards ' +
          'LEFT JOIN board_categories ON board_categories._id = board_boards.board_category_id WHERE board_boards._id = $1',
        [id],
        (error, result) => {
          if (error) return reject(error);
          if (result.rows.length === 0) return resolve(0);
          resolve(BoardDataModel(result.rows[0]));
        }
      );
    });
  }

  /**
   * Get count() of threads of a board
   * @Deprecated what was I thinking 😭
   */
  public static async getCountOfThreads(board: number) {
    const { rows } = await this.conn.query(
      'SELECT COUNT(*) FROM board_threads WHERE board_boards_id = $1',
      [board]
    );

    return rows[0].count;
  }
}
