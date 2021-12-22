import { Request, Response, NextFunction } from 'express';

/**
 * Some function to allow for @middleware()
 *  What this does it it will register the function as a middleware. It will not be called
 *  until we set it as a middleware as a route though.
 *  When we do that, then it will run as a middleware and go next() normally. SIIUUUUU
 */
export function middleware() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      original.call();
      next();
    };
  };
}
