import { Controller, Get, Post, Delete, Patch } from '../../Core/Decorators';
import { param, respond } from '../../Core/Routing';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { IResponse } from '../../Interfaces';
import { BlogService } from '../../Services/Blog/BlogService';

@Controller('/blogs')
export class BlogController {
  @Get('/')
  async getAllArticles(): Promise<IResponse> {
    let response;
    try {
      response = await BlogService.getAllArticles();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  @Get('/user/:userId')
  getAllArticlesFromUser(): IResponse {
    return respond({ m: 'All from user...' }, 200);
  }

  @Post('/', [AuthService.authenticate])
  async createNewBlogArticle(): Promise<IResponse> {
    let response;
    try {
      response = await BlogService.createNewArticle();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  @Get('/article/:articleId')
  async getSingleArticle(): Promise<IResponse> {
    if (isNaN(param('articleId'))) {
      return respond({ error: 'Invalid article id.' }, 400);
    }

    let response;
    try {
      response = await BlogService.getSingleArticle();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  @Patch('/:articleId', [AuthService.authenticate])
  editArticle(): IResponse {
    return respond({ m: 'Blog edited...' }, 200);
  }

  @Delete('/:articleId', [AuthService.authenticate])
  deleteArticle(): IResponse {
    return respond({ m: 'Blog deleted...' }, 200);
  }
}
