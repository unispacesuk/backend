import { Connection } from '../../Config';

export class NotificationService {
  private static client = Connection.client;

  static canSendNotification(type: string, userId: number) {
    return new Promise((resolve, reject) => {
      this.client.query(
        `select notification_settings->'live'->>'${type}' as ${type} from users where _id = $1`,
        [userId],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result.rows[0]);
        }
      );
    });
  }
}
