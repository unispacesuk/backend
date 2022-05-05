import { Connection } from '../../Config';
import { WebsocketChannelManager } from '../../Core/Websockets/WebsocketChannelManager';

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

  static async addBlogVoteNotification(articleId: number, userId: number) {
    const articleOwner = await this.client.query('SELECT user_id FROM blog_posts WHERE _id = $1', [
      articleId,
    ]);
    const user = await this.client.query('SELECT username, avatar FROM users WHERE _id = $1', [
      userId,
    ]);
    const notification = {
      message: `${user.rows[0].username} reacted to your blog article.`,
      user: user.rows[0],
      link: `/blog/article/${articleId}`,
      read: false,
      created_at: new Date(),
    };

    await this.client.query(
      'UPDATE users SET notifications = array_append(notifications, $1) WHERE _id = $2',
      [notification, articleOwner.rows[0].user_id]
    );

    this.sendNotificationBell(articleOwner.rows[0].user_id);
  }

  private static sendNotificationBell(userId: number) {
    const ws = WebsocketChannelManager.getConnections().find((c) => c.user === userId);
    if (!ws) return;

    ws.connection.send(JSON.stringify({ type: 'notification-bell' }));
  }
}
