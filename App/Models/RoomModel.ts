interface IRoom {
  _id: string;
  title: string;
  user_id: number;
  users: number[];
  created_at: Date;
  last_updated: Date;
  status: string;
  permission: string;
}

export interface IRoomModel {
  id: string;
  title: string;
  userId: number;
  users: number[];
  createdAt: Date;
  lastUpdate: Date;
  status: string;
  permission: string;
}

export function RoomModel(data: IRoom): IRoomModel {
  return {
    id: data._id,
    userId: data.user_id,
    title: data.title,
    users: data.users,
    createdAt: data.created_at,
    lastUpdate: data.last_updated,
    status: data.status,
    permission: data.permission,
  };
}
