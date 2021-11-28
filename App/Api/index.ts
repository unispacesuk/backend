import {Router} from "express";
import {Auth} from './Auth';

const Api: Router = Router();
export { Api };

/**
 * Main API Endpoint
 *
 * Here we will set all the routes that need to be called in this api.
 */
Api.use('/', Auth);