import { BaseModel } from './BaseModel';
import { BaseInterface } from '../Interfaces';

interface IThread extends BaseInterface {
  board_category_id: string;
  title: string;
  content: string;
  username?: string;
}

interface IThreadModel extends BaseModel {
  boardCategoryId: string;
  title: string;
  content: string;
  username?: string;
}

export function ThreadModel(data: IThread): IThreadModel {
  return {
    id: data._id,
    userId: data.user_id,
    boardCategoryId: data.board_category_id,
    title: data.title,
    content: data.content,
    createdAt: data.created_at,
    lastUpdated: data.last_updated,
    username: data.username,
  };
}
