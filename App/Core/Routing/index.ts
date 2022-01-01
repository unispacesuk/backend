import { RequestHandler } from './Requests/RequestHandler';
import { RequestContext } from './Requests/RequestContext';
import { ResponseHandler } from './Requests/ResponseHandler';

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

export function response(): ResponseHandler {
  return RequestContext.response();
}

/**
 * We use this method to retrieve a parameter from the url
 * @param p
 */
function param(p = 'all') {
  return request().parameters(p);
}
export { param };

function query(q = 'all') {
  return request().query(q);
}
export { query };
