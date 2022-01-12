import { NextFunction } from 'express';

let goNext: NextFunction;

/**
 * Some function to allow for @middleware()
 *  What this does it it will register the function as a middleware. It will not be called
 *  until we set it as a middleware as a route though.
 *  When we do that, then it will run as a middleware and go next() normally. SIIUUUUU
 */
export function Middleware() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (req: Request, res: Response, next: NextFunction) {
      // @ts-ignore
      goNext = next;
      original.call(this, next);
    };

    return descriptor;
  };
}

// Helper to go next when calling a middleware
export function Next() {
  goNext();
}
