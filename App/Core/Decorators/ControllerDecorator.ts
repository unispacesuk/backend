import 'reflect-metadata';
import { IController } from '../../Interfaces/IController';

/**
 * This will allow us to register a controller route (api.unispaces.uk/controller/....)
 * Then we don't need to create groups of routes and just need to import the controller in Controllers.ts
 * @param path
 * @param middlewares
 * @constructor
 */
export function Controller(path: string, middlewares?: ((key: string) => void)[] | undefined) {
  return (target: object) => {
    const controller: IController = {
      path: path,
      middlewares: middlewares,
    };
    Reflect.defineMetadata('controller', controller, target);
    // Reflect.defineMetadata('controllerMiddlewares', middlewares, target);
    // Reflect.defineMetadata('controller', path, target);
  };
}
