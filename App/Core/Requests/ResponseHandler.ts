import {Response} from "express";

/**
 * Response constructor
 */
export class ResponseHandler {
  _response: Response | undefined;

  constructor(response: Response | undefined) {
    this._response = response;
  }

  send(body: any) {
    this._response?.status(200).send(body);
  }
}