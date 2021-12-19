import {api} from "../../Core/Decorators/Request/ApiDecorator";
import {get} from "../../Core/Decorators/Request/MethodDecorator";
import {request} from "../../Core/Requests";

@api('/q')
export default class Question {

  @get('/get/:id')
  async getQuestion() {

    return {
      m: 'got a question!'
    };
  }

}