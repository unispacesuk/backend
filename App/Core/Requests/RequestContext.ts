import {Request, Response} from "express";
import {RequestHandler, ResponseHandler} from "../Requests";

/**
 * Test for Request Handler
 */
export class RequestContext {

  static _request: Request | undefined;
  static _response: Response | undefined;

  constructor(
    request?: Request,
    response?: Response
  ) {
    if (request)
      RequestContext._request = request;
    if (response)
      RequestContext._response = response;
  }

  static request(): RequestHandler {
    return new RequestHandler(RequestContext._request);
  }

  static response(): ResponseHandler {
    return new ResponseHandler(RequestContext._response);
  }

}