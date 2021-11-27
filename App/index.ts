import * as express from 'express';
import {Config, Connection} from "./Config";

import {Api} from "./Api";

const config = new Config();
const db = new Connection();

const App: express.Express = express();

App.use(express.json());
App.use(new Api().router);

App.listen(config.port, async () => {
  await db.connection.then(() => {
    console.log('|==================================|');
    console.log('|                                  |');
    console.log(`|  Server is running on port ${config.port}  |`);
    console.log('| Database is also up and running. |');
    console.log('|                                  |');
    console.log('|==================================|');
  });
});