import {api} from "../../Core/Decorators/ApiDecorator";
import {get} from "../../Core/Decorators/MethodDecorator";
import {request} from "../../Core/Routing";

@api('/q')
export default class Question {

  @get('/get/:id')
  async getQuestion() {

    return {
      m: 'got a question!'
    };
  }

}