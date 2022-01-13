import { IAnswer } from '../Interfaces/IAnswer';

interface IAnswerModel {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export function AnswerModel(data: IAnswer): IAnswerModel {
  return {
    id: data._id,
    userId: data.user_id,
    content: data.content,
    createdAt: data.created_at,
  };
}
