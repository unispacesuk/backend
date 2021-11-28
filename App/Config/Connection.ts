import {Config} from "./Config";
import {Client} from 'pg';

const config = new Config();
const client = new Client(config.dbUrl);

function Connection() {
  client.connect(error => {
    if (error) return console.log('Could not connect to the Database!!');

    console.log(`|    Database is also connected.   |`);
    console.log('|                                  |');
    console.log('|==================================|');
  });

  return client;
}

export {
  client,
  Connection
};