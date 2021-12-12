import { Router } from 'express';

const router: Router = Router();
export default router;

const routes: Array<any> = [];

export function get(path: string) {
  // console.log('get() was generated');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    routes.push({ path: path, descriptor });

    descriptor.value = async function (...args: any) {
      const t = await original.call(this, ...args);

      args[1].status(200).send(t);
      return t;
    };

  };
}

export function createRoutes() {
  for (const r of routes) {
    router.get(r.path, r.descriptor.value);
  }
}