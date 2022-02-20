export interface IQuestionModel {
  _id?: string;
  user_id?: number;
  title?: string;
  description?: string;
  answers?: object;
  created_at?: Date;
  last_updated?: Date;
  // interface for the response
  id?: string;
  userId?: number;
  createdAt?: Date;
  lastUpdated?: Date;
  tags?: [];
  votes: number;
}

export function QuestionModel(data: IQuestionModel): IQuestionModel {
  return {
    id: data._id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    answers: [data.answers],
    createdAt: data.created_at,
    lastUpdated: data.last_updated,
    tags: data.tags,
    votes: data.votes,
  };
}
