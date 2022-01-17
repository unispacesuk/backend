import { Connection } from '../../Config';
import { param, request, response } from '../../Core/Routing';
import { BoardModel } from '../../Models/BoardModel';
import { CategoryService } from './CategoryService';
import { IBoard } from '../../Interfaces';

interface Body {
  title: string;
  description: string;
  category: number;
}

export class BoardService {
  static conn = Connection.client;

  /**
   * Create a new board
   */
  public static async createNewBoard() {
    const userId = request().data<string>('userId');
    const { title, description, category } = request().body<Body>();

    if ((await CategoryService.categoryExists(category)) === 0) {
      return response().send({ error: 'category does not exist' }, 401).end();
    }

    const { rows } = await this.conn.query(
      'INSERT INTO board_boards (user_id, board_category_id, title, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, category, title, description]
    );
    return Promise.resolve(BoardModel(rows[0]));
  }

  /**
   * Fetch all boards from a category
   * @param category
   */
  public static async getAllBoards(category?: number) {
    // const { category } = param<Body>();
    //
    // if ((await CategoryService.categoryExists(category)) === 0) {
    //   return response().send({ error: 'category does not exist' }, 401).end();
    // }

    const { rows } = await this.conn.query(
      'SELECT * FROM board_boards WHERE board_category_id = $1',
      [category]
    );

    return Promise.all(rows.map(async (b: IBoard) => {
      b.threads = await this.getCountOfThreads(b._id);
      return BoardModel(b);
    }));
  }

  /**
   * Get count() of threads of a board
   */
  public static async getCountOfThreads(board: number) {
    const { rows } = await this.conn.query(
      'SELECT COUNT(*) FROM board_threads WHERE board_boards_id = $1',
      [board]
    );

    return rows[0].count;
  }
}
