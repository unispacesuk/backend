import { RequestHandler } from './Requests/RequestHandler';
import { RequestContext } from './Requests/RequestContext';
import { ResponseHandler } from './Requests/ResponseHandler';
import { Route } from './Route/Route';

export { RequestContext };
export { RequestHandler };
export { ResponseHandler };
export { Route };

export function request(): RequestHandler {
  return RequestContext.request();
}

export function response(): ResponseHandler {
  return RequestContext.response();
}
