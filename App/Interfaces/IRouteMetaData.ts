import {RequestHandler, Request} from "express";

export interface IRouteMetaData {
  path: string;
  method: string;
  middlewares?: RequestHandler<any>[];
  target: () => void;
}
