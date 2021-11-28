import * as express from 'express';
import {Config, Connection} from "./Config";

import {Api} from "./Api";

const config = new Config();

const App: express.Express = express();

App.use(express.json());
App.use('/', Api);

App.listen(config.port, () => {
  console.log('|==================================|');
  console.log('|                                  |');
  console.log(`|  Server is running on port ${config.port}  |`);
  // console.log('|                                  |');
  // console.log('|==================================|');
  Connection();
});