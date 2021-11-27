import {Router} from "express";
import {Login} from "./Login";
import {Register} from "./Register";

/**
 * Authentication Endpoints
 *  - Login
 *  - Register
 *  - JWT Auth
 */
export class Authentication {

  constructor(
    private readonly _auth: Router = Router()
  ) {
    this._auth.use('/', new Login().route);
    this._auth.use('/', new Register().route);
  }

  get routes(): Router {
    return this._auth;
  }
}