import {Router} from 'express';
import { Auth } from './Auth';

export class Api {

  apiRoutes: Router = Router();

  constructor() {
    this.apiRoutes.use(Auth);
  }

  get mainRoutes(): Router {
    return this.apiRoutes;
  }

}