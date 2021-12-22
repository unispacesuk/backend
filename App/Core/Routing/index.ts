import { RequestHandler } from './Requests/RequestHandler';
import { RequestContext } from './Requests/RequestContext';
import { ResponseHandler } from './Requests/ResponseHandler';
import { Route } from './Route/Route';

export { RequestContext };
export { RequestHandler };
export { ResponseHandler };
export { Route };

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
