import {NextFunction, Request, Response, Router} from 'express';
import { Auth } from './Auth';

// test data
import router, {RequestFactory} from '../Decorators/DecoratorFactory';

const Api: Router = Router();
export { Api };

/**
 * This piece of code allows to intercept the request and allows for a good way of getting the body
 *  and organising a response. This then allows for a good way to use decorators 🤙🏼
 */
Api.use((req: Request, res: Response, next: NextFunction) => {
  new RequestFactory(req, res);
  next();
});
const DecTest: Router = router;
Api.use('/t', DecTest);

/**
 * Main API Endpoint
 *
 * Here we will set all the routes that need to be called in this api.
 */
Api.use('/', Auth);

/**
 * Test route
 *  - only to test that the server is connected.
 */
Api.get('/test', (req: Request, res: Response) => {
  res.status(200).send({ m: 'get request is working...' });
});
Api.post('/test', (req: Request, res: Response) => {
  res.status(200).send({ m: 'post request is working...' });
});
