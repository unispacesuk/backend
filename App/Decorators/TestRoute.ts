import { get } from './DecoratorFactory';
import { Connection } from '../Config';

export default class TestRoute {

  @get('/test/:id')
  async test(...args: any) {

    const id = args[0].params.id;

    const { rows } = await Connection.client.query(
      'SELECT * FROM questions WHERE user_id = $1',
      [id]
    );
    return {
      rows
    };
  }
}
