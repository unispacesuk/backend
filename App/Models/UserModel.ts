import { IUser } from '../Interfaces';

interface IUserModel {
  id: string;
  username: string;
  not_username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export function UserModel(data: IUser): IUserModel {
  return {
    id: data._id,
    username: data.username,
    email: data.email,
  };
}
