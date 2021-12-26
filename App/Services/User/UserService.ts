import { AuthenticationService as authService } from '../../Services/Auth/AuthenticationService';
import { IJwtPayload } from '../../Interfaces';
import { response } from '../../Core/Routing';

export class UserService {
  /**
   * Get the user id from the token
   */
  public static async getUserId(token: string) {
    try {
      const { _id } = <IJwtPayload>await authService.verifyToken(token);
      return _id;
    } catch (error) {
      return response().status(400).send({
        message: error,
      });
    }
  }

  /**
   * Get the user role using the id from the token
   * @param token
   */
  // public static async getUserRole(token: string) {
  //   const { _id } = await this.getUserId(token);
  //   return 'admin';
  // }
}
