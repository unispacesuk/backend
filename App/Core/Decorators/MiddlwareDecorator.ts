import {NextFunction} from "express";
import 'reflect-metadata';

export interface middlewareMetaData {
  target: any;
}

export function middleware() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('registered a middleware');
    const original = descriptor.value;
    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      original.call();
      next();
    };

    // const meta: middlewareMetaData = {
    //   target: descriptor.value
    // };
    // const metaDataList = Reflect.getMetadata('middleware', target.constructor) || [];
    // if (!Reflect.hasMetadata('middleware', target.constructor)) {
    //   Reflect.defineMetadata('middleware', metaDataList, target.constructor);
    // }
    // metaDataList.push(meta);
    // Reflect.defineMetadata('middleware', metaDataList, target.constructor);
  };
}