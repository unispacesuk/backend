import { Controller, Post, Get, Patch, Delete } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { RolesService } from '../../Services/Roles/RolesService';
import { IResponse, ICategory } from '../../Interfaces';
import { request, respond } from '../../Core/Routing';
import { CategoryService } from '../../Services/Board/CategoryService';

// This here will get all categories
@Controller('/category')
export class CategoryController {
  /**
   * Post a category
   */
  @Post('/', [AuthService.authenticate, RolesService.isUserAdmin])
  async addNewCategory(): Promise<IResponse> {
    const body: ICategory = request().body<ICategory>();
    if (!body || !body.title || !body.description) {
      return respond({ m: 'fill all details' }, 401);
    }

    // returns the added category
    const category = await CategoryService.addCategory();

    return respond({ category }, 200);
  }

  /**
   * Get all categories and boards for each category
   */
  @Get('/')
  async getAllCategories(): Promise<IResponse> {
    // const categories = await CategoryService.getAllCategoriesAndBoards();
    const categories = await CategoryService.getAllCategories();

    return respond({ categories }, 200);
  }

  @Patch('/', [AuthService.authenticate, RolesService.isUserAdmin])
  async saveCategory(): Promise<IResponse> {
    try {
      await CategoryService.saveCategory();
    } catch (e) {
      return respond({ error: e }, 400);
    }

    return respond({ m: 'success' }, 200);
  }

  @Delete('/:id', [AuthService.authenticate, RolesService.isUserAdmin])
  async deleteCategory(): Promise<IResponse> {
    try {
      await CategoryService.deleteCategory();
    } catch (e) {
      return respond({ error: e }, 400);
    }

    return respond({ m: 'success' }, 200);
  }

  @Get('/duplicate/:id', [AuthService.authenticate, RolesService.isUserAdmin])
  async duplicateCategory() {
    try {
      await CategoryService.duplicateCategory();
    } catch (e) {
      return respond({ error: e }, 400);
    }

    return respond({ m: 'success' }, 200);
  }
}
