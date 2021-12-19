import { NextFunction, Router } from 'express';

export const route: Router = Router();

export function RegisterRoute(
  method: string,
  path: string,
  target: () => void,
  middleware: (n: NextFunction) => void
): any {
  route.get(path, [], middleware, target);
}

/**
 * Route model.
 * This will then avoid us writing the same code on every controller / api endpoint
 */
// export class Request {
//
//   private _router: Router = Router();
//
//   constructor() {
//   }
//
//   registerRoute() {
//
//   }
//
//   get router(): Router {
//     return this._router;
//   }
//
// }
