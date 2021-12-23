import { AuthenticationService as authService } from '../../Services/Auth/AuthenticationService';
import { IJwtPayload } from '../../Interfaces';

export class UserService {
  /**
   * Get the user id from the token
   */
  public static async getUserId(token: string): Promise<any> {
    const { _id } = <IJwtPayload>await authService.verifyToken(token);
    return _id;
  }

  /**
   * Get the user role using the id from the token
   * @param token
   */
  public static async getUserRole(token: string): Promise<any> {
    const { _id } = await this.getUserId(token);
    return 'admin';
  }
}
