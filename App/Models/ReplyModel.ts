import { BaseInterface } from '../Interfaces/BaseInterface';
import { BaseModel } from './BaseModel';

interface IReply extends BaseInterface {
  board_thread_id: string;
  content: string;
}

interface IReplyModel extends BaseModel {
  boardThreadId: string;
  content: string;
}

export function ReplyModel(data: IReply): IReplyModel {
  return {
    id: data._id,
    userId: data.user_id,
    boardThreadId: data.board_thread_id,
    content: data.content,
    createdAt: data.created_at,
    lastUpdated: data.last_updated,
  };
}
