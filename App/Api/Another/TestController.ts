import { Controller, Get, Post } from '../../Core/Decorators';
import { request, respond } from '../../Core/Routing';

import {TestService} from "../../Services/Test/TestService";
import 'reflect-metadata';

@Controller('/test')
export class TestController {
  @Get('/hi')
  function() {

    // const service = Reflect.getMetadata('injectable', TestService);
    // const s2: TestService = new service.target.constructor;
    // s2.testMethod();
    // console.log(this.testService);
    // this.testService.testMethod();

    // s.testMethod();
    // console.log(typeof this.service);
    // const {target} = Reflect.getMetadata('injectable', TestService);
    // const se = new s.constructor;
    // console.log(target);
    // target.testMethod();
    // se.testMethod();

    return respond({m: 'replied'}, 200);
  }
}
