import {Router} from 'express';
import * as dir from 'node-dir';
import 'reflect-metadata';
import {routeMetaData} from "./MethodDecorator";

export const ApiRoute: Router = Router();

export function api(path: string) {
  return generateApiRoute(path);
}

export function generateApiRoute(path: string) {
  return function (target: any) {
    const routes: Router = Router();
    const apiSubs: routeMetaData[] = Reflect.getMetadata('method', target);
    apiSubs.forEach((sub: routeMetaData) => {
      // @ts-ignore
      routes[sub.method].apply(routes, [sub.url, sub.target]);
    });
    ApiRoute.use(path, routes);
  };
}

let apis: string[] = [];
export async function registerApis(path: string): Promise<any> {
  apis = getApis(path);
  apis.forEach((api ) => {
    console.log(api);
    // console.log(Reflect.getMetadata('api', api));
  });
}

function getApis(path: string): string[] {
  return dir.files(path, {sync: true}).filter(p => p.includes('Test.ts'));
}
