export interface IQuestionModel {
  _id?: string;
  user_id?: number;
  title?: string;
  description?: string;
  answers?: number;
  created_at?: Date;
  last_updated?: Date;
  last_replied?: Date;
  // interface for the response
  id?: string;
  userId?: number;
  createdAt?: Date;
  lastUpdated?: Date;
  lastReplied?: Date;
  tags?: [];
  votes: number;
}

export function QuestionModel(data: IQuestionModel): IQuestionModel {
  return {
    id: data._id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    answers: data.answers,
    createdAt: data.created_at,
    lastUpdated: data.last_updated,
    lastReplied: data.last_replied,
    tags: data.tags,
    votes: data.votes,
  };
}
