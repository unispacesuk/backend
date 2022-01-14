import { Controller, Post, Get } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { RolesService } from '../../Services/Roles/RolesService';
import { IResponse } from '../../Interfaces';
import { ICategory } from '../../Interfaces/ICategory';
import { request, respond } from '../../Core/Routing';
import { CategoryService } from '../../Services/Board/CategoryService';

// This here will get all categories
@Controller('/category', [AuthService.authenticate])
export class CategoryController {
  @Post('/add', [RolesService.isUserAdmin])
  async addNewCategory(): Promise<IResponse> {
    const body: ICategory = request().body<ICategory>();
    if (!body || !body.title || !body.description) {
      return respond('fill all details', 401);
    }

    // returns the added category
    const category = await CategoryService.addCategory();

    return respond({ category }, 200);
  }

  /**
   * Get all Cate
   */
  @Get('/get/all')
  async getAllCategories(): Promise<IResponse> {
    const categories = await CategoryService.getAllCategories();

    return respond({ categories }, 200);
  }
}
