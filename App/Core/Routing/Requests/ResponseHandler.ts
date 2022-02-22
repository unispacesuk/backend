import { Response } from 'express';

/**
 * Response constructor
 */
export class ResponseHandler {
  _response: Response | undefined;
  _code = 0;

  constructor(response: Response | undefined) {
    if (response === undefined) {
      return;
    }
    this._response = response;
  }

  status(code: number) {
    // this._response?.status(code);
    this._code = code;
    return this;
  }

  send(body: object, code?: number): this {
    if (!this._response!.headersSent) this._response!.status(this._code | code!).send(body);
    return this;
  }

  end() {
    return this._response!.end();
  }
}
