import * as express from 'express';
import { Config, Connection } from '../Config';
import { Api } from '../Api';
import * as morgan from 'morgan';
import { BodyMiddleware } from '../Middlewares/Body';

export default class App {
  private _express: express.Express;
  private _config: Config;
  private _connection: Connection;
  private _bodyMiddleware: BodyMiddleware;


  constructor() {
    this._express = express();
    this._config = new Config();
    this._connection = new Connection();
    this._bodyMiddleware = new BodyMiddleware();
  }

  public setMiddlewares(): App {
    this._express.use(express.json());
    this._express.use(morgan('dev'));

    this._express.use('/', this._bodyMiddleware.printBody);
    this._express.use('/', new Api().mainRoutes);

    return this;
  }

  public tryConnection(): App {
    this._connection.tryConnection().then(() => {
      console.log('connected!!!!!');
    });

    return this;
  }

  public RunServer(): App {
    this._express.listen(this._config.port, () => {
      console.log('server is on!!!');
    });
    return this;
  }
}
