import { Controller, Get, Post } from '../../Core/Decorators';
import {request, respond} from '../../Core/Routing';
import { IResponse } from '../../Interfaces';

import * as multer from "multer";
import {Config} from "../../Config";
import {AuthenticationService} from "../../Services/Auth/AuthenticationService";
const upload = multer({ storage: Config.storage('avatars') });

@Controller('/test')
export class TestController {
  // @Get('/hi')
  // async testMethod(): Promise<IResponse> {
  //   return respond({ m: 'hello there' }, 200);
  // }
  @Post('/upload', [upload.single('avatar')])
  async upload() {
    console.log('uploaded');
    console.log(request().file());
    return respond({m: 'uploaded'}, 200);
  }
}
