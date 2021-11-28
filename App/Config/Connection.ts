import {Config} from "./Config";
import {Client} from 'pg';

export class Connection {
  private static _config = new Config();
  private static _client = new Client(this._config.dbUrl);

  static tryConnection(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._client.connect().then(() => {
        resolve('Database is connected!!!');
      }).catch((error) => {
        reject('Could not connect to Postgres...');
      });
    });
  }

  static get Client(): Client {
    return this._client;
  }
}

// const config = new Config();
// const client = new Client(config.dbUrl);
//
// function Connection() {
//   client.connect(error => {
//     if (error) return console.log('Could not connect to the Database!!');
//
//     console.log(`|    Database is also connected.   |`);
//     console.log('|                                  |');
//     console.log('|==================================|');
//   });
//
//   return client;
// }
//
// export {
//   client,
//   Connection
// };