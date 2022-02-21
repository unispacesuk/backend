import { IAnswer } from '../Interfaces';

interface IAnswerModel {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  username: string;
  avatar: string;
  best: boolean;
}

export function AnswerModel(data: IAnswer): IAnswerModel {
  return {
    id: data._id,
    userId: data.user_id,
    content: data.content,
    createdAt: data.created_at,
    username: data.username,
    avatar: data.avatar,
    best: data.best,
  };
}
