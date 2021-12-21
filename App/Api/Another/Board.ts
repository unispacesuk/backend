import {get} from "../../Core/Decorators/MethodDecorator";
import {api} from "../../Core/Decorators/ApiDecorator";

@api('/b')
export default class Board {
  @get('/board')
  getBoard() {

    return {
      m: 'got a board'
    };
  }
}