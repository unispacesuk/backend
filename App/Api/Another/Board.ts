import {get} from "../../Core/Decorators/Request/MethodDecorator";
import {api} from "../../Core/Decorators/Request/ApiDecorator";

@api('/b')
export default class Board {
  @get('/board')
  getBoard() {

    return {
      m: 'got a board'
    };
  }
}