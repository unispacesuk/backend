import { IConnection } from '../../Interfaces/IWebsocketConnection';
import { WebsocketChannelManager } from './WebsocketChannelManager';

export abstract class WebsocketChannel {
  private readonly name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  public liveConnections(): IConnection[] {
    return WebsocketChannelManager.getConnections();
  }

  abstract broadcast(data: any): void;
}
