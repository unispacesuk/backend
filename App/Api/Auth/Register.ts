import {Router, Request, Response, NextFunction} from "express";

const Register: Router = Router();
export { Register };

/**
 * Register endpoint
 */
Register.get('/register', async (req, res) => {

  res.send();
});