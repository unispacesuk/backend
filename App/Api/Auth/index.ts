import {Router} from "express";
import {Login} from "./Login";
import {Register} from "./Register";

const Auth: Router = Router();
export { Auth };

/**
 * Authentication Endpoints
 *  - Login
 *  - Register
 *  - JWT Auth
 */
Auth.use('/auth', Login);
Auth.use('/auth', Register);