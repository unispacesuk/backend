import {Request, Response, NextFunction} from "express";
import {request} from "../Requests";

export function authenticate() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    console.log('authentication middleware')
    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      original.call();

      console.log('sdfsdf');

      next();
    };
  };
}