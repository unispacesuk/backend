import { IResponse } from '../../Interfaces';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { RolesService } from '../../Services/Roles/RolesService';
import { Controller, post } from '../../Core/Decorators';

@Controller('/role')
export class RolesController {
  /**
   * We will send a body with the user id and the role to set the user to.
   * The token of the user setting the role will be used to verify the permissions.
   * @private
   */
  @post('/set', [AuthService.authenticate])
  private async setRole(): Promise<IResponse> {
    return {
      code: 200,
      body: {
        message: `role set for user`,
      },
    };
  }
}
