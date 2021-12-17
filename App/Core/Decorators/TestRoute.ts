import { get, post } from './DecoratorFactory';
import { Connection } from '../../Config';
import {RequestContext} from "../Requests";

export default class TestRoute {
  @get('/test/:id')
  async test() {
    const {id} = RequestContext.request().parameters;

    const { rows } = await Connection.client.query('SELECT * FROM questions WHERE user_id = $1', [
      id,
    ]);

    return {
      rows,
    };
  }

  @post('/test2')
  test2() {
    const body = RequestContext.request().body;
    return body;
  }
}
