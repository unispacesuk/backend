import {Router, Request, Response, NextFunction} from "express";

import {findUser} from "../../Services/Auth/LoginService";

const Login: Router = Router();
export { Login };

/**
 * Login endpoint
 */
Login.get('/login', async (req, res) => {
  const user = await findUser(req.body);
  res.send(user);
});