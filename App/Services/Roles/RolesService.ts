import { request, response } from '../../Core/Routing';
import { Connection } from '../../Config';
import { Middleware, Next } from '../../Core/Decorators';
import { QueryResult } from 'pg';

export class RolesService {
  public static async getUserRole(): Promise<string> {
    return 'alright then';
  }

  public static async setUserRole(): Promise<any> {}

  @Middleware()
  public static async isUserAdmin() {
    const id = await request().data('userId');

    let result: QueryResult;
    try {
      result = await Connection.client.query(
        'SELECT * FROM user_roles WHERE user_id = $1 AND role_id = $2',
        [id, 1]
      );
    } catch (e) {
      console.log(e);
    }

    // result will always have a result but needs to be asserted anyway
    if (result!.rowCount === 0) {
      response().send({
        message: 'not enough permissions'
      }, 401);
    }

    Next();
  }
}
