import { BaseInterface } from '../Interfaces';
import { BaseModel } from './BaseModel';

interface IBlog extends BaseInterface {
  title: string;
  content: string;
  user: {
    avatar: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  votes: any[];
}

interface IBlogModel extends BaseModel {
  title: string;
  content: string;
  user: {
    avatar: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  votes: any[];
}

export function BlogModel(data: IBlog): IBlogModel {
  return {
    id: data._id,
    userId: data.user_id,
    createdAt: data.created_at,
    lastUpdated: data.last_updated,
    title: data.title,
    content: data.content,
    user: {
      avatar: data.user.avatar,
      username: data.user.username,
      firstName: data.user.first_name,
      lastName: data.user.last_name,
    },
    votes: data.votes,
  };
}
