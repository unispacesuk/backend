import { response } from '@Requests';
import 'reflect-metadata';

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
      const body = await original.call();
      response().status(body.code).send(body);
    };

    return descriptor;
  };
}

export interface routeMetaData {
  url: string;
  method: string;
  target: any;
}

// interface for the decorator method
interface HttpDecorator {
  (target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
}

export function get(path: string): HttpDecorator {
  return httpRequest('get', path);
}

export function post(path: string): HttpDecorator {
  return httpRequest('post', path);
}

export function patch(path: string): HttpDecorator {
  return httpRequest('patch', path);
}

export function put(path: string): HttpDecorator {
  return httpRequest('put', path);
}

/**
 * delete is a reserved keyword.
 * to do a delete request we do @remove()
 * @param path
 */
export function remove(path: string): HttpDecorator {
  return httpRequest('delete', path);
}

export function head(path: string): HttpDecorator {
  return httpRequest('head', path);
}

export function httpRequest(method: string, path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    console.log(`route for ${path} has been registered`);

    const original = descriptor.value;
    descriptor.value = async function () {
      const body = await original.call();
      response().send(body);
    };

    const meta: routeMetaData = {
      url: path,
      method: method,
      target: descriptor.value
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
