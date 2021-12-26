import {Controller} from "../../Core/Decorators/ControllerDecorator";
import {get} from "../../Core/Decorators/MethodDecorator";

@Controller('/q')
export default class Question {

  @get('/get/:id')
  async getQuestion() {

    return {
      m: 'got a question!'
    };
  }

}