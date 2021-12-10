import { Config } from './Config';
import { Client } from 'pg';

/**
 * Doesn't need to be a class, but can also be a class
 */
export class Connection {
  private static _config = new Config();
  private static _client = new Client(this._config.dbUrl);

  /**
   * Try the database connection
   */
  public tryConnection(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      Connection._client
        .connect()
        .then(() => {
          resolve('Database is connected!!!');
        })
        .catch(() => {
          reject('Could not connect to Postgres...');
        });
    });
  }

  /**
   * Print the connection to be used for queries
   */
  static get client(): Client {
    return this._client;
  }
}
