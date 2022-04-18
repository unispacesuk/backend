import { Controller, Get, Patch, Post } from '../../Core/Decorators';
import { param, respond, file } from '../../Core/Routing';
import { UserService } from '../../Services/User/UserService';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import * as multer from 'multer';
import { Config } from '../../Config';
import { IResponse } from '../../Interfaces';
const upload = multer({ storage: Config.storage('avatars') });

@Controller('/user')
export class UserController {
  @Get('/data/:userId')
  async getUserData() {
    const userId: number = param('userId');
    if (!userId) {
      return respond({ error: 'No user id.' }, 400);
    }

    if (isNaN(userId)) {
      return respond({ error: 'Invalid user id.' }, 400);
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

  @Get('/thread/starred', [AuthService.authenticate])
  async getUserStarredThreads() {
    let response;
    try {
      response = await UserService.getStarredThreads();
    } catch (e) {
      console.log(e);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    return respond({ response }, 200);
  }

  @Patch('/update', [AuthService.authenticate])
  async updateUserProfile(): Promise<IResponse> {
    let response;
    try {
      response = await UserService.updateUserProfile();
    } catch (error) {
      console.error(error);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    return respond({ response }, 200);
  }

  @Patch('/update/password', [AuthService.authenticate])
  async updateUserPassword(): Promise<IResponse> {
    try {
      // check if the current password is correct
      if (!(await UserService.isValidPassword())) {
        return respond({ error: 'The current password is wrong.' }, 400);
      }

      // check if the passwords match
      if (!UserService.doPasswordsMatch()) {
        return respond({ error: 'The new passwords do not match.' }, 400);
      }

      // update the password
      await UserService.updateUserPassword();
    } catch (error) {
      console.error(error);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    return respond({ message: 'Password updated.' }, 200);
  }
}
