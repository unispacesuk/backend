interface RouteI {
  (method: string, path: string): void;
}

export class Route {

  _method: string;
  _path: string;

  constructor(method: string, path: string) {
    this._method = method;
    this._path = path;
  }

  createRoute(): RouteI {
    return function (method, path) {

    }
  }

}