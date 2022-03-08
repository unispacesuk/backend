import { BaseModel } from './BaseModel';
import { BaseInterface } from '../Interfaces';

interface IThread extends BaseInterface {
  board_category_id: string;
  title: string;
  content: string;
  username?: string;
  avatar?: string;
  board_title?: string;
  cat_title?: string;
}

interface IThreadModel extends BaseModel {
  boardCategoryId: string;
  title: string;
  content: string;
  username?: string;
  avatar?: string;
  boardTitle?: string;
  catTitle?: string;
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
    avatar: data.avatar,
    boardTitle: data.board_title,
    catTitle: data.cat_title,
  };
}
