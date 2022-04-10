import 'reflect-metadata';

export function Injectable() {
  return function (target: any) {
    initiateService(target);
  };
}

export function Service() {
  return function (target: any, propertyKey: string) {
    console.log(propertyKey);
  };
}

function initiateService(target: any) {
  const dependencies = Reflect.getMetadata('design:paramtypes', target) || [];
  const injections = dependencies.map((token: any) => initiateService(token));

  return new target(...injections);
}
