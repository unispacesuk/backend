import {Request} from "express";

/**
 * Request constructor
 */
export class RequestHandler {
  _request: Request | undefined;

  constructor(request: Request | undefined) {
    this._request = request;
  }

  get headers() {
    return this._request?.headers;
  }

  /**
   * We use any as the return type because we can pass anything as a parameter and we want to be able
   *  to destructure an object in the route method.
   */
  get parameters(): any {
    return this._request?.params;
  }

  /**
   * Return the request body
   * TODO: maybe make it not return anything if there is no body 🤔
   */
  get body(): any {
    return this._request?.body;
  }

  get method(): any {
    return this._request?.method;
  }
}