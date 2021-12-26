import { Express, Router } from 'express';
import { LoginController } from './Auth/LoginController';
import { RegisterController } from './Auth/RegisterController';
import 'reflect-metadata';
import { AuthenticationController } from './Auth/AuthenticationController';
import { QuestionController } from './Question/QuestionController';

export class Api {
  app: Express;
  apiRoutes: Router = Router();

  constructor(app: Express) {
    this.app = app;
    // this.apiRoutes.use(Auth);
    // this.apiRoutes.use(Question);
  }

  /**
   * This can be refactored to fetch all controllers and register them in the main route.
   * That can be achieved by reading all the files in the Api (to be renamed Controllers) folder.
   * @private
   */
  private static getControllers(): any[] {
    return [
      LoginController,
      RegisterController,
      AuthenticationController,
      QuestionController,
    ];
  }

  public registerControllers(): Api {
    Api.getControllers().forEach((controller) => {
      const Controller = new controller();
      const path = Reflect.getMetadata('controller', controller);
      this.apiRoutes.use(path, Controller.route);
    });

    return this;
  }

  public registerRoutes() {
    this.app.use('/', this.apiRoutes);
  }

  // get mainRoutes(): Router {
  //   return this.apiRoutes;
  // }
}
