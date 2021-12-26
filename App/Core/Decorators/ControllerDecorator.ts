import 'reflect-metadata';

/**
 * This will allow us to register a controller route (api.unispaces.uk/controller/....)
 * Then we don't need to create groups of routes and just need to import the controller in Controllers.ts
 * @param path
 * @constructor
 */
export function Controller(path: string) {
  return (target: any) => {
    Reflect.defineMetadata('controller', path, target);
  };
}
