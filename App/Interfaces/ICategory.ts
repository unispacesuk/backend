import { BaseInterface } from './BaseInterface';

export interface ICategory extends BaseInterface {
  title: string;
  description: string;
  boards: any[];
  board_count?: number;
  thread_count?: number;
  reply_count?: number;
}
