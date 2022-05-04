import { Websocket } from '../Core/Decorators/WebsocketDecorator';
import { WebsocketChannel } from '../Core/Websockets/WebsocketChannel';
import { IConnection } from '../Interfaces/IWebsocketConnection';
import { NotificationService } from '../Services/User/NotificationService';

@Websocket('notifications-channel')
export class NotificationsWebsocket extends WebsocketChannel {
  constructor(name: string) {
    super(name);
  }

  async broadcast(data: any): Promise<void> {
    const ws: IConnection | undefined = this.liveConnections().find(
      (connection) => connection.user === data.metadata.receiver
    );

    if (!ws) return;

    const canSend: any = await NotificationService.canSendNotification(
      data.metadata.type,
      data.metadata.receiver
    );

    if (canSend.article_reacted === 'false') return;

    ws.connection.send(JSON.stringify(data));
  }
}
