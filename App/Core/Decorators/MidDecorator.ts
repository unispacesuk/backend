import 'reflect-metadata';

export default function mid() {
  return function (target: any) {
    const middleware = init(target);
    Reflect.defineMetadata(target, middleware, target);
  };
}

// if there are any injections on the constructor then run recursively
function init(target: any) {
  return new target();
}
