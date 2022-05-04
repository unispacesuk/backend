import { WebSocket } from 'ws';

export interface IConnection {
  connection: WebSocket;
  user: number;
  isAlive: boolean;
  // channel?: string;
}
