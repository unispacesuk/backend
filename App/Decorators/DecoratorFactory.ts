import {Request, Router, Response} from 'express';
import {IncomingMessage} from "http";

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

      // args[1].status(200).send(t);
      // return t;
      RequestFactory.respond(t);
    };

    return descriptor;
  };
}

export function createRoutes() {
  for (const r of routes) {
    router.get(r.path, r.descriptor.value);
  }
}

/**
 * Test for Request Handler
 */
export class RequestFactory {

  // _request: Request | IncomingMessage | undefined;
  static _request: Request;
  static _response: Response;

  constructor(
    // request: Request | IncomingMessage,
    request: Request,
    response: Response
  ) {
    RequestFactory._request = request;
    RequestFactory._response = response;
  }

  static getBody(): any {
    // return RequestFactory._request.body;
    // return 'hi';
  }

  static respond(response: any): void {
    console.log(RequestFactory._request);
    RequestFactory._response.status(200).send(response);
  }

  static getHeaders() {
    return RequestFactory._request.headers;
  }

}