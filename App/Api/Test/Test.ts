// import { middleware } from '../../Core/Decorators/MiddlwareDecorator';
import {get, post} from "../../Core/Decorators/Request/MethodDecorator";
import {api} from "../../Core/Decorators/Request/ApiDecorator";

@api('/g')
export class Test {
  constructor() {
    // RegisterRoute('get', '/getworld/:id', this.getworld, this.test);
  }

  @get('/get')
  getworld() {

    return {
      m: '/get'
    };
  }

  @post('/post')
  postWorld() {
    return {
      body: '/post'
    };
  }

  // @middleware()
  // test() {
  //   console.log('middleware');
  // }
}
