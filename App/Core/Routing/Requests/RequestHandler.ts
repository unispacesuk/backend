import { Request } from 'express';
import { IncomingHttpHeaders } from 'http2';

/**
 * Request constructor
 */
export class RequestHandler {
  _request: Request | undefined;

  constructor(request: Request | undefined) {
    this._request = request;
  }

  get headers() {
    return <IncomingHttpHeaders>this._request?.headers;
  }

  /**
   * We use any as the return type because we can pass anything as a parameter and we want to be able
   *  to destructure an object in the route method.
   */
  get parameters(): any {
    return this._request?.params;
  }

  /**
   * We need sometimes to get the queries from the url so we use this method.
   * api.unispaces.uk/endpoint?key=value&key=value&key=value
   */
  get query(): any {
    return this._request?.query;
  }

  /**
   * Return the request body
   * TODO: maybe make it not return anything if there is no body 🤔
   */
  get body(): object | any {
    return this._request?.body;
  }

  get method(): string {
    return this._request!.method;
  }

  /**
   * We use this to get the token from the headers once it gets validated by the auth middleware
   *
   * THIS WILL ONLY BE CALLED WHEN THERE IS A TOKEN!!!
   */
  get token(): string {
    return this.headers.authorization!.split(' ')[1];
  }
}
