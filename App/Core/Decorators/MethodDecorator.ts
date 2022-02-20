import { response } from '../Routing';
import { IResponse } from '../../Interfaces';
import { IRouteMetaData } from '../../Interfaces';
import 'reflect-metadata';
import { RequestHandler } from 'express';

// type for the main http decorator
type HttpDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;

export function Get(path: string, middlewares?: RequestHandler<any>[]): HttpDecorator {
  return httpRequest('get', path, middlewares);
}

export function Post(path: string, middlewares?: RequestHandler<any>[]): HttpDecorator {
  return httpRequest('post', path, middlewares);
}

export function Patch(path: string, middlewares?: RequestHandler<any>[]): HttpDecorator {
  return httpRequest('patch', path, middlewares);
}

export function Put(path: string, middlewares?: RequestHandler<any>[]): HttpDecorator {
  return httpRequest('put', path, middlewares);
}

/**
 * delete is a reserved keyword.
 * to do a delete request we do @Remove() or @Eliminate() or @Delete()
 * @param path
 * @param middlewares
 */
export function Remove(path: string, middlewares?: RequestHandler<any>[]): HttpDecorator {
  return httpRequest('delete', path, middlewares);
}
export function Eliminate(path: string, middlewares?: RequestHandler<any>[]): HttpDecorator {
  return httpRequest('delete', path, middlewares);
}
export function Delete(path: string, middlewares?: RequestHandler<any>[]): HttpDecorator {
  return httpRequest('delete', path, middlewares);
}

export function Head(path: string, middlewares?: RequestHandler<any>[]): HttpDecorator {
  return httpRequest('head', path, middlewares);
}

export function Options(path: string, middlewares?: RequestHandler<any>[]): HttpDecorator {
  return httpRequest('options', path, middlewares);
}

export function httpRequest(
  method: string,
  path: string,
  middlewares?: RequestHandler<any>[] | undefined
): HttpDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async () => {
      const body: IResponse = await original.call();
      response().status(body.code).send(body.body);
    };

    const routeMetaData: IRouteMetaData = {
      path: path,
      method: method,
      middlewares: middlewares,
      target: descriptor.value,
    };

    const metaDataList = Reflect.getMetadata('method', target.constructor) || [];
    if (!Reflect.hasMetadata('method', target.constructor)) {
      Reflect.defineMetadata('method', metaDataList, target.constructor);
    }
    metaDataList.push(routeMetaData);
    Reflect.defineMetadata('method', metaDataList, target.constructor);

    return descriptor;
  };
}
