import {Router} from "express";
import {Authentication} from './Auth';

/**
 * Main API Endpoint
 *
 * Here we will set all the routes that need to be called in this api.
 */
export class Api {

  constructor(
    private readonly _router: Router = Router()
  ) {
    this._router = Router();
    this._router.use('/auth', new Authentication().routes);
  }

  /**
   * Getter for the main router
   */
  get router(): Router {
    return this._router;
  }

}