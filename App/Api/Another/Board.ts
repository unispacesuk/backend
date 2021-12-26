import {get} from "../../Core/Decorators/MethodDecorator";
import {Controller} from "../../Core/Decorators/ControllerDecorator";

@Controller('/b')
export default class Board {
  @get('/board')
  getBoard() {

    return {
      m: 'got a board'
    };
  }
}