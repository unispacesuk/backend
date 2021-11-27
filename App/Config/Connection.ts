import {Config} from "./Config";
import {Client} from 'pg';

const config = new Config();

export class Connection {

  private readonly _client: Client;

  constructor() {
    this._client = new Client(config.dbUrl);
  }

  get connection(): Promise<void> {
    return this.client.connect();
  }

  get client(): Client {
    return this._client;
  }

}