import { NextFunction, Request, Response } from 'express';
import { RequestHandler, ResponseHandler } from '../index';

// export type RequestRoute = (req: Request, res: Response, next: NextFunction) => any;

export class RequestContext {
  static _request: Request;
  static _response: Response;

  /**
   * Initiate a middleware for the decorators
   * @param request
   * @param response
   * @param next
   */
  initRouter(request: Request, response: Response, next: NextFunction) {
    RequestContext._request = request;
    RequestContext._response = response;

    next();
  }

  static request(): RequestHandler {
    return new RequestHandler(RequestContext._request);
  }

  static response(): ResponseHandler {
    return new ResponseHandler(RequestContext._response);
  }
}
