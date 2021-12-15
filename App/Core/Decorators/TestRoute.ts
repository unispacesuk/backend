import {get, RequestFactory as rf} from './DecoratorFactory';
import { Connection } from '../../Config';

export default class TestRoute {

  @get('/test')
  async test() {
    // const id = args[0].params.id;
    const id = 6;

    const { rows } = await Connection.client.query('SELECT * FROM questions WHERE user_id = $1', [
      id,
    ]);

    console.log(rf.request().headers);
    // console.log(RequestFactory.getHeaders());

    return {
      rows,
    };
  }
}
