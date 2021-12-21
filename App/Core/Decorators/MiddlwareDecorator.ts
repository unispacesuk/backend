import { Request, Response, NextFunction } from 'express';

/**
 * Some function to allow for @middleware()
 *
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
