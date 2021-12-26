import { Express, Router } from 'express';
import { LoginController } from './Auth/LoginController';
import { RegisterController } from './Auth/RegisterController';
import { AuthenticationController } from './Auth/AuthenticationController';
import { QuestionController } from './Question/QuestionController';
import { RolesController } from './Roles/RolesController';
import { IRouteMetaData } from '../Interfaces/IRouteMetaData';
import 'reflect-metadata';

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
      RolesController,
    ];
  }

  public registerControllers(): Api {
    Api.getControllers().forEach((controller) => {
      const group: { [n: string]: any } = Router();
      // const Controller = new controller();
      const path = Reflect.getMetadata('controller', controller);
      // this.apiRoutes.use(path, Controller.route);

      Reflect.getMetadata('method', controller).forEach((route: IRouteMetaData) => {
        if (route.middlewares) {
          group[route.method].apply(group, [route.path, route.middlewares, route.target]);
        } else {
          group[route.method].apply(group, [route.path, route.target]);
        }
      });

      this.apiRoutes.use(path, <Router>group);
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
