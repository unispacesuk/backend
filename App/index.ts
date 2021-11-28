import * as express from 'express';
import {Config, Connection} from "./Config";

import {Api} from "./Api";

const config = new Config();

const App: express.Express = express();

App.use(express.json());
App.use('/', Api);

App.listen(config.port, () => {
  Connection.tryConnection().then((res) => {
    console.log('|==================================|');
    console.log('|                                  |');
    console.log(`| Server is running on port :${config.port}  |`);
    console.log(`| ${res}         |`);
    console.log('|                                  |');
    console.log('|==================================|');
  }).catch((err) => console.log(err));
});