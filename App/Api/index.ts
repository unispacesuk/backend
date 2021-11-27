import {Router} from "express";
import {AuthRoutes} from './Auth';

export class Api {

  constructor(
    private readonly _router: Router = Router()
  ) {
    this._router = Router();
    this._router.use('/auth', new AuthRoutes().routes);
  }

  get router(): Router {
    return this._router;
  }

}