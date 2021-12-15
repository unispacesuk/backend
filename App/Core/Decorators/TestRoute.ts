import { get, post } from './DecoratorFactory';
import { RequestContext as rc } from '../Requests';
import { Connection } from '../../Config';

export default class TestRoute {
  @get('/test')
  async test() {
    // const id = args[0].params.id;
    const id = 6;

    const { rows } = await Connection.client.query('SELECT * FROM questions WHERE user_id = $1', [
      id,
    ]);

    console.log(rc.request().headers);
    console.log(rc.request().body);
    // console.log(RequestFactory.getHeaders());

    return {
      rows,
    };
  }

  @post('/test2')
  async test2() {
    console.log(rc.request().body);

    console.log(rc.response()._response);

    rc.response().send({ m: 'nice!!!!' });
  }
}
