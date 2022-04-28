import { IUser } from '../Interfaces';

interface IUserModel {
  id: string;
  username: string;
  not_username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar: string;
  roleId: number;
  privacy: object;
}

export function UserModel(data: IUser): IUserModel {
  return {
    id: data._id,
    username: data.username,
    email: data.email,
    avatar: data.avatar,
    firstName: data.first_name,
    lastName: data.last_name,
    roleId: data.role_id,
    privacy: data.privacy_settings,
  };
}
