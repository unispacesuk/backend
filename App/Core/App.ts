import * as express from 'express';
import { Config, Connection } from '../Config';
import { Api } from '../Api';
import * as morgan from 'morgan';
import { BodyMiddleware } from '../Middlewares/Body';

// test data
import TestRoute from '../Decorators/TestRoute';
import { createRoutes } from '../Decorators/DecoratorFactory';

export default class App {
  private _express: express.Express;
  private _config: Config;
  private _connection: Connection;
  private _bodyMiddleware: BodyMiddleware;

  // test data
  private _testRoute: TestRoute;

  constructor() {
    this._express = express();
    this._config = new Config();
    this._connection = new Connection();
    this._bodyMiddleware = new BodyMiddleware();

    // test data
    this._testRoute = new TestRoute();
    createRoutes();
  }

  public setMiddlewares(): App {
    this._express.use(express.json());
    this._express.use(morgan('dev'));

    this._express.use('/', this._bodyMiddleware.printBody);
    this._express.use('/', Api);

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
