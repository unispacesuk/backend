import { Middleware, Next } from '../Core/Decorators';
import { respond } from '../Core/Routing';
import { UserService } from '../Services/User/UserService';

// temp interface
interface IRole {
  role_id: number;
}

export class AdminMiddleware {
  @Middleware()
  static async isAdmin() {
    try {
      const { role_id } = <IRole>await UserService.isUserAdmin();

      if (role_id !== 1) {
        return respond({ error: 'You do not have permission for this action.' }, 401);
      }
    } catch (error) {
      return respond({ error }, 400);
    }

    Next();
  }
}
