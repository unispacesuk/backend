import { BaseInterface } from './BaseInterface';

export interface IThread extends BaseInterface {
  title: string;
  content: string;
  board: number;
}
