import { Controller, Delete, Get, Patch, Post } from '../../Core/Decorators';
import { file, param, request, respond } from '../../Core/Routing';
import { UserService } from '../../Services/User/UserService';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import * as multer from 'multer';
import { Config } from '../../Config';
import { IResponse } from '../../Interfaces';
import { Logger } from '@ricdotnet/logger/dist';

const upload = multer({ storage: Config.storage('avatars') });
const resource = multer({ storage: Config.resource('resources') });

@Controller('/user')
export class UserController {
  @Get('/data/:username')
  async getUserData() {
    const username: string = param('username');
    if (!username) {
      return respond({ error: 'No username provided.' }, 400);
    }

    let user: any;

    try {
      user = await UserService.getUserData();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    if (!user) {
      return respond({ error: 'No user found with that username.' }, 200);
    }

    if (user.privacy.profile) {
      return respond({ error: "This user's profile is private.", private: true }, 200);
    }

    return respond({ user }, 200);
  }

  @Get('/data/id/:userId')
  async getUserDataById(): Promise<IResponse> {
    let response;
    try {
      response = await UserService.getUserDataById(param('userId'));
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
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
      Logger.error(e);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    return respond({ response }, 200);
  }

  @Patch('/update', [AuthService.authenticate])
  async updateUserProfile(): Promise<IResponse> {
    let response;
    try {
      response = await UserService.updateUserProfile();
      await UserService.setLastUpdated();
    } catch (error) {
      Logger.error(error);
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
      await UserService.setLastUpdated();
    } catch (error) {
      console.error(error);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    return respond({ message: 'Password updated.' }, 200);
  }

  // maybe not needed....
  @Get('/privacy', [AuthService.authenticate])
  async getUserPrivacySettings(): Promise<IResponse> {
    return respond({ m: 'hey' }, 200);
  }

  @Patch('/privacy', [AuthService.authenticate])
  async updateUserPrivacySettings(): Promise<IResponse> {
    try {
      await UserService.updateUserPrivacySettings();
    } catch (error) {
      Logger.error(error);
    }

    return respond({ m: 'hey' }, 200);
  }

  @Get('/notification-settings', [AuthService.authenticate])
  async getUserNotificationSettings(): Promise<IResponse> {
    const userId = request().data('userId');

    let response;
    try {
      response = await UserService.getUserNotificationSettings(Number(userId));
    } catch (error) {
      Logger.error(error);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    return respond({ response }, 200);
  }

  @Patch('/notification-settings', [AuthService.authenticate])
  async updateUserNotificationSettings(): Promise<IResponse> {
    let response;
    try {
      response = await UserService.updateUserNotificationSettings();
      await UserService.setLastUpdated();
    } catch (error) {
      Logger.error(error);
      return respond({ error: 'Something went wrong.' }, 400);
    }

    return respond({ response }, 200);
  }

  @Get('/search/:username')
  async searchUser(): Promise<IResponse> {
    let response;
    try {
      response = await UserService.searchUser();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  @Get('/notifications', [AuthService.authenticate])
  async getNotifications(): Promise<IResponse> {
    let response;
    try {
      response = await UserService.getUserNotifications();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  @Post('/upload/resource', [AuthService.authenticate, resource.single('resource-file')])
  async uploadResource(): Promise<IResponse> {
    try {
      await UserService.saveResourceFile();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }
    return respond({ m: 'resource uploaded' }, 200);
  }

  @Get('/resources', [AuthService.authenticate])
  async getUserResources(): Promise<IResponse> {
    let response;
    try {
      response = await UserService.getResourceFiles();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 200);
    }

    return respond({ response }, 200);
  }

  @Delete('/resource/:resourceId', [AuthService.authenticate])
  async deleteResourceFile(): Promise<IResponse> {
    try {
      await UserService.deleteResourceFile();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 200);
    }

    return respond({ m: 'resource file deleted' }, 200);
  }

  @Post('/read-later/:articleId', [AuthService.authenticate])
  async addToReadLaterList(): Promise<IResponse> {
    try {
      await UserService.addToReadLaterList();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ m: 'added to read later' }, 200);
  }

  @Delete('/read-later/:articleId', [AuthService.authenticate])
  async removeFromReadLaterList(): Promise<IResponse> {
    try {
      await UserService.removeFromReadLaterList();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ m: 'removed from read later' }, 200);
  }

  @Get('/read-later/:articleId', [AuthService.authenticate])
  async checkIfOnReadLaterList(): Promise<IResponse> {
    let response;
    try {
      response = await UserService.getArticleFromReadLaterList();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  @Get('/read-later/get/all', [AuthService.authenticate])
  async getReadLaterList(): Promise<IResponse> {
    let response;
    try {
      response = await UserService.getReadLaterList();
    } catch (error) {
      Logger.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }
}
