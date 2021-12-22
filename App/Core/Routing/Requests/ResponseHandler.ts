import {Response} from "express";

/**
 * Response constructor
 */
export class ResponseHandler {
  _response: Response | undefined;

  constructor(response: Response | undefined) {
    this._response = response;
  }

  status(code: number) {
    this._response?.status(code);
    return this;
  }

  send(body: any) {
    if (!this._response?.headersSent)
      this._response?.send(body);
    return this;
  }

  end(): any {
    return this._response?.end();
  }
}