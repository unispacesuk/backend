import { BaseInterface } from '../Interfaces';
import { BaseModel } from './BaseModel';

interface IThreadReply extends BaseInterface {
  board_thread_id: number;
  content: string;
  username: string;
  avatar: string | null;
}

interface IThreadReplyModel extends BaseModel {
  boardThreadId: number;
  content: string;
  username: string;
  avatar: string | null;
}

export function ThreadReplyModel(data: IThreadReply): IThreadReplyModel {
  return {
    id: data._id,
    boardThreadId: data.board_thread_id,
    content: data.content,
    createdAt: data.created_at,
    lastUpdated: data.last_updated,
    username: data.username,
    avatar: data.avatar,
  };
}
