import {Request, Router, Response} from 'express';
import {RequestContext} from "../Requests";

const router: Router = Router();
export default router;

const routes: Array<any> = [];

export function get(path: string) {
  // console.log('get() was generated');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    routes.push({ method: 'get', path: path, descriptor });

    descriptor.value = async function (...args: any) {
      const t = await original.call(this, ...args);

      // args[1].status(200).send(t);
      // return t;
      RequestContext.response().send({t});
    };

    return descriptor;
  };
}

export function post(path: string) {
  // console.log('get() was generated');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    routes.push({ method: 'post', path: path, descriptor });

    descriptor.value = async function () {
      // const t = await original.call(this, ...args);

      // args[1].status(200).send(t);
      // return t;
      // RequestFactory.response().send({t});
      RequestContext.response().send({m: 'complete'});
    };

    return descriptor;
  };
}

export function createRoutes() {
  for (const r of routes) {
    if (r.method === 'get')
      router.get(r.path, r.descriptor.value);

    if (r.method === 'post')
      router.post(r.path, r.descriptor.value);
  }
}