import 'reflect-metadata';

// eslint-disable-next-line @typescript-eslint/ban-types
export function Injectable<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    t = 'hi';
    // Reflect.set(some, 'injectable', 'some value yay');
    // console.log(target);
    // const metaData = {
    //   target: target,
    // };
    // Reflect.defineMetadata('injectable', metaData, target);
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function Service(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  // console.log(target.constructor.name);
  // console.log(propertyKey);
  // console.log(parameterIndex);
  const existing = [];
  existing.push(parameterIndex);
  Reflect.defineMetadata(target.constructor.name, existing, target, propertyKey);
}
