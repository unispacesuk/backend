import {Router} from "express";

import {auth} from './Login';

export class AuthRoutes {

  constructor(
    private readonly _user: Router = Router()
  ) {
    this._user.use('/', auth);
  }

  get routes(): Router {
    return this._user;
  }

}