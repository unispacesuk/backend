import * as express from 'express';
import { Config, Connection } from '../Config';
import { Api } from '../Api';
import * as morgan from 'morgan';
import { BodyMiddleware } from '../Middlewares/Body';

// test data
import TestRoute from './Decorators/TestRoute';
import {createRoutes, RequestFactory} from './Decorators/DecoratorFactory';
import {NextFunction, Request, Response} from "express";

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

    /**
     * This piece of code allows to intercept the request and allows for a good way of getting the body
     *  and organising a response. This then allows for a good way to use decorators 🤙🏼
     */
    this._express.use((req: Request, res: Response, next: NextFunction) => {
      new RequestFactory(req, res);
      next();
    });

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
