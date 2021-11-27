import {Router} from "express";

export const auth: Router = Router();

auth.get('/login', (req, res) => {
  console.log('hey');
  res.end();
});