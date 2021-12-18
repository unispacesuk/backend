import { Router } from 'express';
import * as dir from 'node-dir';

const ApiRoute: Router = Router();
const ApiRoutes: Router[] = [];

// interface ApiDecorator {
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   <T extends {new (...args: any[])}>(constructor: Function): any;
// }

export function api(path: string) {
  return generateApiRoute(path);
}

export function generateApiRoute(path: string) {
  return function (target: any) {
    ApiRoute.use(path);
  };
}

let apis: string[] = [];
export async function getApis(path: string): Promise<any> {
  apis = dir.files(path, {sync: true}).filter(p => p.includes('Test.ts'));
}
