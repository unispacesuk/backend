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

  get body() {
    return 'some body';
  }
}