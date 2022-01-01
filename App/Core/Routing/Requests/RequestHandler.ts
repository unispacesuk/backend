import { IncomingHttpHeaders } from 'http2';
import { IRequest } from '../../../Interfaces';

/**
 * Request constructor
 */
export class RequestHandler {
  _request: IRequest | undefined;

  constructor(request: IRequest | undefined) {
    this._request = request;
  }

  get headers() {
    return <IncomingHttpHeaders>this._request?.headers;
  }

  /**
   * Setter to set any custom data that we want to pass from the middlewares.
   * @param args
   */
  data(args: { [key: string]: any }) {
    for (const arg in args) {
      this._request![arg] = args[arg];
    }
  }

  async Data(): Promise<any> {
    return this._request;
  }

  /**
   * We use any as the return type because we can pass anything as a parameter and we want to be able
   *  to destructure an object in the route method.
   */
  parameters(p: string): any {
    if (p === 'all') return this._request?.params;
    return this._request?.params[p];
  }

  /**
   * We need sometimes to get the queries from the url so we use this method.
   * api.unispaces.uk/endpoint?key=value&key=value&key=value
   */
  query(q: string): any {
    if (q === 'all') return this._request?.query;
    return this._request?.query[q];
  }

  /**
   * Return the request body
   * TODO: maybe make it not return anything if there is no body 🤔
   */
  get body(): object | any {
    return this._request?.body;
  }

  get method(): any {
    return this._request?.method;
  }

  /**
   * We use this to get the token from the headers once it gets validated by the auth middleware
   *
   * THIS WILL ONLY BE CALLED WHEN THERE IS A TOKEN!!!
   */
  get token(): any {
    return this.headers.authorization?.split(' ')[1];
  }
}
