import { request, response } from '../../Core/Routing';
import { Connection } from '../../Config';
import { Middleware, Next } from '../../Core/Decorators';

export class RolesService {
  public static async getUserRole(): Promise<string> {
    return 'alright then';
  }

  public static async setUserRole(): Promise<any> {}

  @Middleware()
  public static async isUserAdmin() {
    const { id } = await request().Data();
    Connection.client.query(
      `SELECT * FROM user_roles WHERE user_id = $1 AND role_id = $2`,
      [id, 1],
      async (error, result) => {
        if (error) return error.message;
        if (!(result.rowCount > 0)) {
          return response().status(400).send({
            message: 'not enough permissions',
          });
        } else {
          Next();
        }
      }
    );
  }
}
