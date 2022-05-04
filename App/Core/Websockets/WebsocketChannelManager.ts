import { WebsocketChannel } from './WebsocketChannel';
import { IConnection } from '../../Interfaces/IWebsocketConnection';

export class WebsocketChannelManager {
  private static channels: WebsocketChannel[] = [];
  private static connections: IConnection[] = [];

  public static addChannel(channel: WebsocketChannel) {
    this.channels.push(channel);
  }

  public static getChannels(): WebsocketChannel[] {
    return this.channels;
  }

  public static getConnections(): IConnection[] {
    return this.connections;
  }
}
