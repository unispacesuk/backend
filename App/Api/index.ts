import { Router } from 'express';
import { Auth } from './Auth';
import {Test} from "./Test/Test";
import {ApiRoute} from "../Core/Decorators/Request/ApiDecorator";
import Question from "./Another/Question";
import Board from "./Another/Board";
// import { Tests } from './Test';

export class Api {
  apiRoutes: Router = Router();

  constructor() {
    this.apiRoutes.use(Auth);

    // here I will start class/api main routes
    new Test();
    new Question();
    new Board();

    this.apiRoutes.use(ApiRoute);
    // this.apiRoutes.use(Tests);
  }

  get mainRoutes(): Router {
    return this.apiRoutes;
  }
}
