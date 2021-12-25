import { Response } from 'express';

/**
 * Response constructor
 */
export class ResponseHandler {
  _response: Response | undefined;
  _code = 0;

  constructor(response: Response | undefined) {
    this._response = response;
  }

  status(code: number) {
    // this._response?.status(code);
    this._code = code;
    return this;
  }

  send(body: object) {
    if (!this._response?.headersSent) this._response?.status(this._code).send(body);
    return this;
  }

  end(): any {
    return this._response?.end();
  }
}
