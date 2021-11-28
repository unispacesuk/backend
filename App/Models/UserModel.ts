export interface IUserResponse {
  id: number;
  username: string;
  email: string;
}

export function UserResponse(data: any): IUserResponse {
  return {
    id: data._id,
    username: data.username,
    email: data.email
  };
}