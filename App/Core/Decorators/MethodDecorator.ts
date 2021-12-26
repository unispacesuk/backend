import { response } from '../Routing';
import 'reflect-metadata';
import { IResponse } from '../../Interfaces';

/**
 * We will use a @route() decorator to generate "routes"
 * This will allow us to just return a body from the controller function and the decorator
 *  will handle the response.
 */
export function route() {
  return prepareRoute();
}

function prepareRoute() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async () => {
      const body: IResponse = await original.call();
      response().status(body.code).send(body.body);
    };

    return descriptor;
  };
}

// WILL MAYBE NEED THIS IN THE FUTURE
export interface routeMetaData {
  path: string;
  method: string;
  middlewares?: (() => void)[];
  target: () => void;
}

// type for the main http decorator
type HttpDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;

export function get(path: string, middlewares?: (() => void)[]): HttpDecorator {
  return httpRequest('get', path, middlewares);
}

export function post(path: string, middlewares?: (() => void)[]): HttpDecorator {
  return httpRequest('post', path, middlewares);
}

export function patch(path: string, middlewares?: (() => void)[]): HttpDecorator {
  return httpRequest('patch', path, middlewares);
}

export function put(path: string, middlewares?: (() => void)[]): HttpDecorator {
  return httpRequest('put', path, middlewares);
}

/**
 * delete is a reserved keyword.
 * to do a delete request we do @remove()
 * @param path
 * @param middlewares
 */
export function remove(path: string, middlewares?: (() => void)[]): HttpDecorator {
  return httpRequest('delete', path, middlewares);
}

export function head(path: string, middlewares?: (() => void)[]): HttpDecorator {
  return httpRequest('head', path, middlewares);
}

export function httpRequest(
  method: string,
  path: string,
  middlewares?: (() => void)[]
): HttpDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async () => {
      const body: IResponse = await original.call();
      response().status(body.code).send(body.body);
    };

    const meta: routeMetaData = {
      path: path,
      method: method,
      middlewares: middlewares,
      target: descriptor.value,
    };

    const metaDataList = Reflect.getMetadata('method', target.constructor) || [];
    if (!Reflect.hasMetadata('method', target.constructor)) {
      Reflect.defineMetadata('method', metaDataList, target.constructor);
    }
    metaDataList.push(meta);
    Reflect.defineMetadata('method', metaDataList, target.constructor);

    return descriptor;
  };
}
