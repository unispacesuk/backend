import {Request, Response, NextFunction} from "express";
import {sign, verify} from 'jsonwebtoken';
import {Config} from "../../Config";
import {MoreRequest} from "../../Interfaces/MoreRequest";

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

  public static verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      verify(token, this._config.secret, (error, payload) => {
        if (error) reject(error);
        resolve(payload);
      });
    });
  }

  /**
   * Authentication middleware method
   */
  public static async authenticate(req: MoreRequest, res: Response, next: NextFunction) {
    const token: any = req.headers.authorization?.split(' ')[1];

    if (!token)
      return res.status(400).send({error: 'Unauthorized', reason: 'No token provided'});

    console.log(await AuthenticationService.verifyToken(token));

    next();
  }

}