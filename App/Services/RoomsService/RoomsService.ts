import { Connection } from '../../Config';
import { UserService } from '../User/UserService';
import { param, query, request } from '../../Core/Routing';
import { IRoomModel, RoomModel } from '../../Models/RoomModel';

export class RoomsService {
  static client = Connection.client;

  // this function will fetch all rooms
  // we also want to check if the user is an admin or not and if not then do not send the admin only rooms
  static async getAllRooms() {
    const { role_id } = await UserService.isUserAdmin();

    const permission = role_id === 1 ? 'admin' : 'all';

    const values: string[] = [];
    let query = 'SELECT * FROM chat_rooms';

    if (permission !== 'admin') {
      values.push('all');
      query += ` WHERE permission = $${values.length}`;
    }

    return new Promise((resolve, reject) => {
      this.client.query(query, [...values], (error, result) => {
        if (error) return reject(error);
        if (!result.rows.length) return resolve(null);
        return resolve(result.rows.map((room) => RoomModel(room)));
      });
    });
  }

  // todo: add user permission in case a non-valid user fetches a room... maybe check on the controller?
  static async getRoomData(): Promise<IRoomModel | null> {
    const { roomId } = param();

    return new Promise((resolve, reject) => {
      this.client.query('SELECT * FROM chat_rooms WHERE _id = $1', [roomId], (error, result) => {
        if (error) return reject(error);
        if (!result.rows.length) return resolve(null);
        return resolve(RoomModel(result.rows[0]));
      });
    });
  }

  // we want to remove any private rooms that the user does not have access
  static async filterPrivateRooms(rooms: IRoomModel[]): Promise<IRoomModel[]> {
    const userId: number | void = request().data('userId');
    const { role_id } = await UserService.isUserAdmin();

    if (role_id === 1) {
      return Promise.resolve(rooms);
    }

    const privateRooms: IRoomModel[] = [];
    const publicRooms: IRoomModel[] = [];

    return new Promise((resolve) => {
      for (const room of rooms) {
        // this is ugly but
        if (
          userId !== room.userId &&
          room.status === 'private' &&
          room.users?.includes(<number>userId)
        ) {
          // check for private rooms that I do not own
          privateRooms.push(room);
        } else if (userId === room.userId && room.status === 'private') {
          // check for private rooms that I own
          privateRooms.push(room);
        } else if (room.status === 'public' && room.permission === 'all') {
          // check for any public rooms
          publicRooms.push(room);
        }
      }
      resolve([...publicRooms, ...privateRooms]);
    });
  }

  static createRoom(): Promise<IRoomModel> {
    const userId = request().data('userId');
    const { title, status } = request().body();

    return new Promise((resolve, reject) => {
      this.client.query(
        'INSERT INTO chat_rooms (title, user_id, status) VALUES ($1, $2, $3) RETURNING *',
        [title, userId, status],
        (error, result) => {
          if (error) return reject(error);
          return resolve(RoomModel(result.rows[0]));
        }
      );
    });
  }

  static async deleteRoom() {
    const userId = request().data('userId');
    const { roomId } = param();

    const { role_id } = await UserService.isUserAdmin();

    const values = [roomId];
    let query = 'DELETE FROM chat_rooms WHERE _id = $1';
    if (role_id !== 1) {
      values.push(userId);
      query += ' AND user_id = $2';
    }

    return new Promise((resolve, reject) => {
      this.client.query(query, [...values], (error) => {
        if (error) return reject(error);
        resolve(null);
      });
    });
  }

  static async updateRoom() {
    const userId = request().data('userId');
    const { roomId } = param();
    const { title, status } = request().body();

    const { role_id } = await UserService.isUserAdmin();

    const values = [title, status, roomId];
    let query = 'UPDATE chat_rooms SET title = $1, status = $2 WHERE _id = $3';

    if (role_id !== 1) {
      values.push(userId);
      query += ` AND user_id = $${values.length}`;
    }

    return new Promise((resolve, reject) => {
      this.client.query(query, [...values], (error) => {
        if (error) return reject(error);
        return resolve(null);
      });
    });
  }

  // admins cannot invite people for now
  // only allow owners to add users
  static async inviteUser() {
    const userId = request().data('userId');
    const { roomId } = param();
    const { invitee } = query();

    const userAlreadyInvited = await this.isUserInRoom(roomId, Number(invitee));
    if (userAlreadyInvited) {
      return Promise.resolve('duplicate-user');
    }

    return new Promise((resolve, reject) => {
      this.client.query(
        'UPDATE chat_rooms SET users = array_append(users, $1) WHERE _id = $2 AND user_id = $3',
        [invitee, roomId, userId],
        (error) => {
          if (error) return reject(error);
          return resolve(null);
        }
      );
    });
  }

  static async isUserInRoom(roomId: string, invitee: number) {
    const result = await this.client.query('SELECT users FROM chat_rooms WHERE _id = $1', [roomId]);

    return Promise.resolve(result.rows[0].users.includes(invitee));
  }
}