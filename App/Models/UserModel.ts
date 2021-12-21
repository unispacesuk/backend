export interface UserModel {
  _id: number;
  username: string;
  not_username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export function UserResponse(data: UserModel): UserModel {
  return {
    _id: data._id,
    username: data.username,
    email: data.email
  };
}