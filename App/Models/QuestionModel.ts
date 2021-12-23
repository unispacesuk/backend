export interface IQuestionModel {
  _id?: string;
  user_id?: number;
  title?: string;
  content?: string;
  answers?: object;
  created_at?: Date;
  last_updated?: Date;
  // interface for the response
  id?: string;
  userId?: number;
  createdAt?: Date;
  lastUpdated?: Date;
}

export function QuestionModel(data: IQuestionModel): IQuestionModel {
  return {
    id: data._id,
    userId: data.user_id,
    title: data.title,
    content: data.content,
    answers: [
      data.answers
    ],
    createdAt: data.created_at,
    lastUpdated: data.last_updated
  };
}