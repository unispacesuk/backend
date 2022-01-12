export interface IController {
  path: string;
  middlewares?: ((key: string) => void)[] | undefined;
}