import { Express, Router } from 'express';
import { IRouteMetaData } from '../Interfaces/IRouteMetaData';
import { IController } from '../Interfaces/IController';
import { files } from 'node-dir';
import 'reflect-metadata';
import * as path from 'path';

export class Api {
  static app: Express;
  static apiRoutes: Router = Router();

  constructor(app: Express) {
    Api.app = app;
  }

  /**
   * This can be refactored to fetch all controllers and register them in the main route.
   * That can be achieved by reading all the files in the Api (to be renamed Controllers) folder.
   * @private
   */
  private static async getControllers(): Promise<any[]> {
    const fs = files(path.join(__dirname), { sync: true });
    const controllers: any[] = [];

    for (const c of fs) {
      if (c.includes('Controller')) {
        controllers.push(await import(c));
      }
    }

    return controllers;
  }

  /**
   * TODO: Maybe this needs some refactoring 🤔
   * Look horrible but it works alright
   */
  public async registerControllers(): Promise<Api> {
    const controllers: any[] = await Api.getControllers();
    for (const controller of controllers) {
      // (await Api.getControllers()).forEach((controller) => {
      const group: { [n: string]: any } = Router();
      // const Controller = new controller();
      const c = Object.values(controller)[0];
      const controllerData: IController = Reflect.getMetadata('controller', <object>c);
      // this.apiRoutes.use(path, Controller.route);

      Reflect.getMetadata('method', <object>c).forEach((route: IRouteMetaData) => {
        if (route.middlewares) {
          group[route.method].apply(group, [route.path, route.middlewares, route.target]);
        } else {
          group[route.method].apply(group, [route.path, route.target]);
        }
      });

      // This will register a global middleware defined on the @Controller decorator
      if (controllerData.middlewares) {
        Api.apiRoutes.use(controllerData.path, controllerData.middlewares, <Router>group);
      } else {
        Api.apiRoutes.use(controllerData.path, <Router>group);
      }

      // Api.apiRoutes.use(controllerData.path, <Router>group);
      // });
    }

    return this;
  }

  public static registerRoutes() {
    Api.app.use('/', Api.apiRoutes);
  }
}
