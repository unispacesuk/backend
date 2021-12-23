import { Router } from 'express';
import { Auth } from './Auth';
import { Question } from './Question';

export class Api {
  apiRoutes: Router = Router();

  constructor() {
    this.apiRoutes.use(Auth);
    this.apiRoutes.use(Question);
  }

  get mainRoutes(): Router {
    return this.apiRoutes;
  }
}
