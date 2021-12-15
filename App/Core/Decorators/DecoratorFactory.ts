import {Request, Router, Response} from 'express';
import {IncomingMessage, ServerResponse} from "http";

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
      RequestFactory.response().send({t});
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

  static _request: Request | undefined;
  static _response: Response | undefined;

  constructor(
    request?: Request,
    response?: Response
  ) {
    if (request)
      RequestFactory._request = request;
    if (response)
      RequestFactory._response = response;
  }

  static request(): RequestB {
    return new RequestB(RequestFactory._request);
  }

  static response(): ResponseB {
    return new ResponseB(RequestFactory._response);
  }

}

/**
 * Request constructor
 */
export class RequestB {
  _request: Request | undefined;

  constructor(request: Request | undefined) {
    this._request = request;
  }

  get headers() {
    return this._request?.headers;
  }
}

/**
 * Response constructor
 */
export class ResponseB {
  _response: Response | undefined;

  constructor(response: Response | undefined) {
    this._response = response;
  }

  send(body: any) {
    this._response?.status(200).send(body);
  }
}