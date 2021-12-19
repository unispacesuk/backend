/**
 * Whenever a user sends a post request with a body, we want to print that body in the log console.
 * This allows to keep a log of all bodies ever send to the server for security purposes.
 * Later I will add way to log this to a file / table on the database.
 */
import { middleware } from '../Core/Decorators/MiddlwareDecorator';
import { request } from '../Core/Requests';

export class BodyMiddleware {
  /**
   * TODO: Loop the body and remove any password or api key that might be send in the body.
   */
  @middleware()
  public printBody() {
    if (request().method === 'POST') {
      console.log(request().body);
    }
  }
}
