/**
 * Whenever a user sends a post request with a body, we want to print that body in the log console.
 * This allows to keep a log of all bodies ever send to the server for security purposes.
 * Later I will add way to log this to a file / table on the database.
 */
import {NextFunction, Request, Response} from "express";

export class BodyMiddleware {

  public printBody(req: Request, res: Response, next: NextFunction): void {
    console.log(req.body);
    next();
  }

}