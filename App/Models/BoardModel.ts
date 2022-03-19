import { BaseModel } from './BaseModel';
import { IBoard } from '../Interfaces';

interface IBoardModel extends BaseModel {
  categoryId: number;
  title: string;
  description: string;
  threads: number;
  replies: number;
  // categoryTitle: string;
}

export function BoardModel(data: IBoard): IBoardModel {
  return {
    id: data._id,
    userId: data.user_id,
    categoryId: data.board_category_id,
    title: data.title,
    description: data.description,
    createdAt: data.created_at,
    lastUpdated: data.last_updated,
    threads: data.threads | 0,
    replies: data.replies | 0,
    // categoryTitle: data.cat_title,
  };
}
