import { Injectable } from '../../Core/Decorators/InjectableDecorator';

@Injectable
export class TestService {
  testMethod() {
    console.log('hi');
  }
}
