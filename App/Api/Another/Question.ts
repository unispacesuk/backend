import {Controller} from "../../Core/Decorators/ControllerDecorator";
import {Get} from "../../Core/Decorators/MethodDecorator";

@Controller('/q')
export default class Question {

  @Get('/get/:id')
  async getQuestion() {

    return {
      m: 'got a question!'
    };
  }

}