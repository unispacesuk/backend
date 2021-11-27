import {Router, Request, Response, NextFunction} from "express";

/**
 * Register Endpoint
 */
export class Register {

  constructor(
    private readonly _register: Router = Router()
  ) {
    this._register.post('/register', this.doRegister);
  }

  async doRegister(req: Request, res: Response, next: NextFunction) {
    console.log('register route');
    res.status(200).send({message: 'Registered!!!'});
  }

  /**
   * Getter for the register route
   */
  get route(): Router {
    return this._register;
  }

}