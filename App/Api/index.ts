import { Request, Response, Router } from 'express';
import { Auth } from './Auth';

// test data
import router from '../Decorators/DecoratorFactory';

const Api: Router = Router();
export { Api };

// test data
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
