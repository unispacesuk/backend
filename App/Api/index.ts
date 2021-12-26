import { Express, Router } from 'express';
import { LoginController } from './Auth/LoginController';
import { RegisterController } from './Auth/RegisterController';
import 'reflect-metadata';
import { AuthenticationController } from './Auth/AuthenticationController';
import { QuestionController } from './Question/QuestionController';
import { Middleware } from '../Core/Decorators';

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
    return [LoginController, RegisterController, AuthenticationController, QuestionController];
  }

  public registerControllers(): Api {
    Api.getControllers().forEach((controller) => {
      const group: Router = Router();
      // const Controller = new controller();
      const path = Reflect.getMetadata('controller', controller);
      // this.apiRoutes.use(path, Controller.route);

      Reflect.getMetadata('method', controller).forEach((route: any) => {
        // @ts-ignore
        group[route.method].apply(group, [
          route.path,
          route.middlewares ? route.middlewares : this.voidMiddleware,
          route.target,
        ]);
      });

      this.apiRoutes.use(path, group);
    });

    return this;
  }

  public registerRoutes() {
    this.app.use('/', this.apiRoutes);
  }

  @Middleware()
  voidMiddleware() {
    // why? why not?
  }

  // get mainRoutes(): Router {
  //   return this.apiRoutes;
  // }
}
