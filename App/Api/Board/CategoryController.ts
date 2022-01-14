import { Controller, Post, Get } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { RolesService } from '../../Services/Roles/RolesService';
import { IResponse } from '../../Interfaces';
import {ICategory} from "../../Interfaces/ICategory";
import {request} from "../../Core/Routing";

// This here will get all categories
@Controller('/category', [AuthService.authenticate])
export class CategoryController {
  @Post('/add', [RolesService.isUserAdmin])
  async addNewCategory(): Promise<IResponse> {

    const body: ICategory = request().body<ICategory>();

    return {
      code: 200,
      body: {
        message: 'category added',
      },
    };
  }

  /**
   * Get all Cate
   */
  @Get('/get/all')
  async getAllCategories() {}
}
