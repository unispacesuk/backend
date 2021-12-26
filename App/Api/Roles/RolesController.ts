import { route } from '../../Core/Decorators';
import { Route } from '../../Core/Routing';
import { IResponse } from '../../Interfaces';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { RolesService } from '../../Services/Roles/RolesService';
import { Controller } from '../../Core/Decorators/ApiDecorator';

@Controller('/role')
export class RolesController extends Route {
  constructor() {
    super();
    this.createRoute({
      method: 'post',
      path: '/set',
      controller: this.setRole,
      middlewares: [AuthService.authenticate],
    });
  }

  /**
   * We will send a body with the user id and the role to set the user to.
   * The token of the user setting the role will be used to verify the permissions.
   * @private
   */
  @route()
  private async setRole(): Promise<IResponse> {
    return {
      code: 200,
      body: {
        message: `role set for user`,
      },
    };
  }
}
