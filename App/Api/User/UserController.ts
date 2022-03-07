import { Controller, Get, Post } from '../../Core/Decorators';
import { param, respond, file } from '../../Core/Routing';
import { UserService } from '../../Services/User/UserService';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import * as multer from 'multer';
import { Config } from '../../Config';
const upload = multer({ storage: Config.storage('avatars') });

@Controller('/user')
export class UserController {
  @Get('/data/:userId')
  async getUserData() {
    if (!param('userId')) {
      return respond({ error: 'No user id.' }, 400);
    }

    const user = await UserService.getUserData().catch((e) => {
      console.log(e);
      return respond({ error: e }, 400);
    });

    if (!user) {
      return respond({ error: 'No user found with that id' }, 400);
    }

    return respond({ user }, 200);
  }

  @Get('/avatar')
  async getUserAvatar() {
    const avatar = `https://avatars.dicebear.com/api/male/${Math.round(Math.random() * 10)}.svg`;
    return respond({ avatar }, 200);
  }

  @Post('/avatar', [AuthService.authenticate, upload.single('avatar')])
  async updateUserAvatar() {
    if (!file()) {
      return respond({ error: 'No file uploaded.' }, 400);
    }

    const avatar = await UserService.setUserAvatar();

    return respond({ avatar }, 200);
  }
}
