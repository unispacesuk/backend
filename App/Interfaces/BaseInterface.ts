export interface BaseInterface<T = string, N = number> {
  _id: N;
  user_id?: T;
  created_at?: T;
  last_updated?: T;
}