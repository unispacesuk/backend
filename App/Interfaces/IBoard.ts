import { BaseInterface } from './BaseInterface';

export interface IBoard extends BaseInterface {
  board_category_id: number;
  title: string;
  description: string;
  threads: number;
  replies: number;
  // cat_title: string;
  access: boolean;
}
