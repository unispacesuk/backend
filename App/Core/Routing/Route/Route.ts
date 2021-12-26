import { Router } from 'express';
import { Middleware } from '../../Decorators';

interface RouteOptions {
  method: string;
  path: string;
  controller: () => void;
  middlewares?: (() => void)[];
}

export class Route {
  private _route: Router = Router();

  createRoute(options: RouteOptions) {
    // @ts-ignore
    this._route[options.method].apply(this._route, [
      options.path,
      options.middlewares ? options.middlewares : this.voidMiddleware,
      options.controller,
    ]);
  }

  @Middleware()
  voidMiddleware() {
    // why? why not?
  }

  get route(): Router {
    return this._route;
  }
}
