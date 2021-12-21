import {NextFunction} from "express";

export class NextHandler {
  _next: NextFunction = (): NextFunction => {
    return this._next;
  };

  constructor(next: NextFunction) {
    this._next = next;
  }

  go() {
    this._next();
  }
}