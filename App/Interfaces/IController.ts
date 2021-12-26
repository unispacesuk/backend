export interface IController {
  path: string;
  target: () => void;
}