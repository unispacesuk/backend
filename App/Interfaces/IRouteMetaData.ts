export interface IRouteMetaData {
  path: string;
  method: string;
  middlewares?: (() => void)[];
  target: () => void;
}