import {AuthenticationService as authService } from "@Services/Auth/AuthenticationService";
import {IJwtPayload} from "../../Interfaces/IJwtPayload";

export class UserService {
  /**
   * Get the user id from the token
   */
  public static async getUserId(token: string): Promise<string | undefined> {
    const {_id} = <IJwtPayload>await authService.verifyToken(token);
    return _id;
  }
}