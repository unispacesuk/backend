import {Router} from "express";
import {Login} from "./Login";
import {Register} from "./Register";

// TODO: Convert to a class

const Auth: Router = Router();
export { Auth };

/**
 * Authentication Endpoints
 *  - Login
 *  - Register
 *  - JWT Auth
 */
Auth.use('/auth', new Login().loginRoute);
Auth.use('/auth', new Register().registerRoute);