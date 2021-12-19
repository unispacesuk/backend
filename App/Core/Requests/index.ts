import { RequestHandler } from './RequestHandler';
import { RequestContext } from './RequestContext';
import { ResponseHandler } from './ResponseHandler';

export { RequestContext };
export { RequestHandler };
export { ResponseHandler };

export function request(): RequestHandler {
  return RequestContext.request();
}

export function response(): ResponseHandler {
  return RequestContext.response();
}