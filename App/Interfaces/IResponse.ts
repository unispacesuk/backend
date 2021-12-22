export interface IResponse<T = number, O = object> {
  code: T;
  body: O;
}