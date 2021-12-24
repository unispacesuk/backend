import { Router } from 'express';
import { LoginController } from './LoginController';
import { RegisterController } from './RegisterController';
import { AuthenticationController } from './AuthenticationController';

const Auth: Router = Router();
export { Auth };

/**
 * AuthenticationController Endpoints
 *  - LoginController
 *  - RegisterController
 *  - JWT Auth
 */
Auth.use('/auth', [
  new LoginController().route,
  new RegisterController().route,
  new AuthenticationController().route
]);