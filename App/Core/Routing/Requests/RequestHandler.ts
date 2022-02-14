import { IncomingHttpHeaders } from 'http2';
import { IRequest } from '../../../Interfaces';

interface IncomingHeaders extends IncomingHttpHeaders {
  authorization: string;
}

/**
 * Request constructor
 */
export class RequestHandler {
  _request: IRequest;

  constructor(request: IRequest) {
    this._request = request;
  }

  headers() {
    return <IncomingHeaders>this._request.headers;
  }

  /**
   * Setter to set any custom data that we want to pass from the middlewares.
   * @param arg
   */
  // setData(args: { [key: string]: any }) {
  //   for (const arg in args) {
  //     this._request![arg] = args[arg];
  //   }
  // }
  //
  // getData(key: string) {
  //   return this._request![key];
  // }
  data<T>(arg?: string | {[key: string]: T}): T | void {
    if (typeof arg === "object") {
        for (const a in arg) {
          this._request[a] = arg[a];
        }
        return;
    }

    if (arg)
      return this._request[arg];
  }

  /**
   * We use any as the return type because we can pass anything as a parameter and we want to be able
   *  to destructure an object in the route method.
   */
  parameters(p: string): any {
    if (p === 'all') return this._request.params;
    return this._request.params[p];
  }

  /**
   * We need sometimes to get the queries from the url so we use this method.
   * api.unispaces.uk/endpoint?key=value&key=value&key=value
   */
  query(q: string): any {
    if (q === 'all') return this._request.query;
    return this._request.query[q];
  }

  /**
   * Return the request body
   * TODO: maybe make it not return anything if there is no body 🤔
   */
  body<T>(key?: string): T {
    return this._request.body || this._request.body[key!];
  }

  method(): string {
    return this._request.method;
  }

  file() {
    return this._request.file;
  }

  /**
   * We use this to get the token from the headers once it gets validated by the auth middleware
   *
   * THIS WILL ONLY BE CALLED WHEN THERE IS A TOKEN!!!
   */
  token() {
    return this.headers().authorization.split(' ')[1];
    // return this.headers.authorization.split(' ')[1];
  }
}
