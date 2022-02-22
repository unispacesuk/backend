import { NextFunction, Request, Response } from 'express';
import { RequestHandler, ResponseHandler } from '../index';

// export type RequestRoute = (req: Request, res: Response, next: NextFunction) => any;

export class RequestContext {
  static _request: Request;
  // _response: Response | undefined = undefined;

  /**
   * Initiate a middleware for the decorators
   * @param request
   * @param response
   * @param next
   */
  initRouter(request: Request, response: Response, next: NextFunction) {
    RequestContext._request = request;

    next();
  }

  // initRequest(request: Request) {
    // RequestContext._request = request;
  // }

  // initResponse(response: Response) {
  //   this._response = response;
  // }

  static request(): RequestHandler {
    return new RequestHandler(RequestContext._request);
  }

  // response(): ResponseHandler {
  //   return new ResponseHandler(this._response);
  // }
}
