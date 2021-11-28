import {sign, verify} from 'jsonwebtoken';
import {Config} from "../../Config";

/**
 * This is the authentication middleware
 * The payload data will be used to get the user details and verify other user related data
 */
export class AuthenticationService {

  static token = '';
  private static _config = new Config();

  static generateToken(data: any): string {
    this.token = sign(data, this._config.secret, {
      algorithm: "HS256",
      expiresIn: '5 days'
    });

    return this.token;
  }

  static verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      verify(token, this._config.secret, (error, payload) => {
        if (error) reject(error);
        resolve(payload);
      });
    });
  }

}