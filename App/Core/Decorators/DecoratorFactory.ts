import { Router } from 'express';
import { RequestContext } from '../Requests';
import 'reflect-metadata';

const router: Router = Router();
export default router;

const routes: RouteI[] = [];

// interface for the decorator method
interface HttpDecorator {
  (target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
}

interface RouteI {
  method: string | string[],
  path: string,
  descriptor: PropertyDescriptor
}

export function all(path: string): HttpDecorator {
  return httpRequest(['get', 'head', 'post', 'put', 'patch', 'delete'], path);
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

export function httpRequest(method: string | string[], path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    routes.push({ method: method, path: path, descriptor });

    descriptor.value = async function () {
      const response = await original.call();
      RequestContext.response().send(response);
    };

    return descriptor;
  };
}

export function createRoutes() {
  for (const r of routes) {
    // maybe we can have some abstraction here to not have to repeat all this ugliness
    if (r.method === 'get') router.get(r.path, r.descriptor.value);
    if (r.method === 'post') router.post(r.path, r.descriptor.value);
    if (r.method === 'patch') router.patch(r.path, r.descriptor.value);
    if (r.method === 'put') router.put(r.path, r.descriptor.value);
  }
}
