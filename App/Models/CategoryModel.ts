import { BaseModel } from './BaseModel';
import { ICategory } from '../Interfaces';

interface ICategoryModel extends BaseModel {
  title: string;
  description: string;
  boards?: any[];
  boardCount?: number;
  threadCount?: number;
  replyCount?: number;
}

export function CategoryModel(data: ICategory): ICategoryModel {
  return {
    id: data._id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    createdAt: data.created_at,
    lastUpdated: data.last_updated,
    boards: data.boards,
    boardCount: data.board_count,
    threadCount: data.thread_count,
    replyCount: data.reply_count,
  };
}
