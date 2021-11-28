import {Config} from "./Config";
import {Client} from 'pg';

export class Connection {
  private static _config = new Config();
  private static _client = new Client(this._config.dbUrl);

  static tryConnection(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._client.connect().then(() => {
        resolve('Database is connected!!!');
      }).catch(() => {
        reject('Could not connect to Postgres...');
      });
    });
  }

  static get Client(): Client {
    return this._client;
  }
}