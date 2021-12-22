import { Router } from 'express';
import { Login } from './Login';
import { Register } from './Register';
import { Authentication } from './Authentication';

const Auth: Router = Router();
export { Auth };

/**
 * Authentication Endpoints
 *  - Login
 *  - Register
 *  - JWT Auth
 */
Auth.use('/auth', [
  new Login().route,
  new Register().route,
  new Authentication().route
]);