export interface IUser {
  _id: string;
  username: string;
  not_username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  last_updated: Date;
  last_login: Date;
}