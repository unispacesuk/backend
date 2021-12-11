export interface UserModel {
  _id: number;
  username: string;
  email: string;
}

export function UserResponse(data: UserModel): UserModel {
  return {
    _id: data._id,
    username: data.username,
    email: data.email
  };
}