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
// generics below
// function request<T>(key: string): T;
// function request<T>(key?: string): T | RequestHandler {
//   if (key) {
//     return request().parameters[key];
//   }
//
//   return RequestContext.request();
// }
export { request };

function response(): ResponseHandler {
  return RequestContext.response();
}
export { response };

export function respond(body: string | object, code: number): IResponse {
  return {
    code: code,
    body: {
      body,
    },
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
