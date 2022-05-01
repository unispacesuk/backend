import { RequestHandler } from './Requests/RequestHandler';
import { RequestContext } from './Requests/RequestContext';
import { ResponseHandler } from './Requests/ResponseHandler';
import { IResponse } from '../../Interfaces';

export { RequestContext };
export { RequestHandler };
export { ResponseHandler };

function request(): RequestHandler;
function request(): RequestHandler {
  return RequestContext.request();
}

export { request };

function response(): ResponseHandler | boolean {
  // return RequestContext.response();
  return true;
}
export { response };

export function respond(body: object, code: number): IResponse {
  return {
    code: code,
    body,
  };
}

/**
 * We use this method to retrieve a parameter from the url
 * @param p
 */
function param<T>(p = 'all'): T {
  return request().parameters(p);
}
export { param };

function query<T>(q = 'all'): T {
  return request().query(q);
}
export { query };

function file() {
  return request().file();
}
export { file };
