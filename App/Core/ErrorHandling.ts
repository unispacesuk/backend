import { request, response } from './Routing';
import { Middleware, Next } from './Decorators';

export class ErrorHandling {
  @Middleware()
  static async error() {
    // if (typeof request() === )
    console.log(response());

    Next();
  }
}
