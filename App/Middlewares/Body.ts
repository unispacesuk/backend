/**
 * Whenever a user sends a post request with a body, we want to print that body in the log console.
 * This allows to keep a log of all bodies ever send to the server for security purposes.
 * Later I will add way to log this to a file / table on the database.
 */
import { Middleware, Next } from '../Core/Decorators';
import { request } from '../Core/Routing';
import { Logger } from '@ricdotnet/logger/dist';

export class BodyMiddleware {
  /**
   * TODO: Loop the body and remove any password or api key that might be send in the body.
   */
  @Middleware()
  public printBody() {
    const methods: string[] = ['POST', 'PUT', 'PATCH'];
    if (methods.includes(request().method()) && request().body) {
      const privates = ['not_username', 'password', 'token'];
      const body: object = request().body();
      // privates.map(p => {
      //   if (body[p])
      //     body[p] = '***';
      // });

      if (Object.keys(body).length !== 0) {
        // console.log(body);
        Logger.info(JSON.stringify(body));
      }
    }

    Next();
  }
}
