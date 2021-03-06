import 'reflect-metadata';
import * as express from 'express';
import { Config, Connection } from '../Config';
import { Api } from '../Api';
import * as morgan from 'morgan';
import { BodyMiddleware } from '../Middlewares/Body';
import { RequestContext } from './Routing';
import * as cors from 'cors';
import * as process from 'process';
import { WebsocketServer } from './Websockets/WebsocketServer';
import { Logger } from '@ricdotnet/logger/dist';

export default class App {
  private _express: express.Express;
  private _config: Config;
  private _connection: Connection;
  private _bodyMiddleware: BodyMiddleware;
  private _wss: WebsocketServer | undefined = undefined;

  constructor() {
    this._express = express();
    this._config = new Config();
    this._connection = new Connection();
    this._bodyMiddleware = new BodyMiddleware();
    setTimeout(() => {
      this._wss = new WebsocketServer();
    }, 2000);
  }

  public setMiddlewares(): App {
    this._express.use(express.json());
    this._express.use(cors());
    this._express.use(morgan('dev'));
    this._express.use('/avatar', express.static('uploads/avatars'));
    this._express.use('/resource', express.static('uploads/resources'));

    // initiate a middleware for requests
    // this will register a request, response, next object
    // it will allow us to create routes without having to repeat request, response in all methods 🤔
    this._express.use(new RequestContext().initRouter);
    this._express.use('/', this._bodyMiddleware.printBody);

    this._express.use((req, res, next) => {
      const listener = (error: any) => {
        console.log('---------- UNHANDLED PROMISE REJECTION -----------');
        console.log(error);
        res.status(500).send('Something went wrong.');
      };

      // process.once('unhandledRejection', listener);
      process.once('UncaughtExceptionListener', listener);

      res.on('finish', () => {
        // process.removeListener('unhandledRejection', listener);
        process.removeListener('UncaughtExceptionListener', listener);
      });

      next();
    });

    return this;
  }

  public initialiseRoutes(): App {
    // this._express.use('/', new Api().mainRoutes);
    new Api(this._express).registerControllers().then(() => Api.registerRoutes());
    return this;
  }

  public tryConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._connection.tryConnection());
      } catch (error) {
        reject(error);
      }
    });
  }

  public runServer(): App {
    this._express.listen(this._config.port, () => {
      Logger.info(`Server is up and running on port: ${this._config.port}`);
    });
    return this;
  }
}
