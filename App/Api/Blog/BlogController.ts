import { Controller, Get, Post, Delete, Patch } from '../../Core/Decorators';
import { param, request, respond } from '../../Core/Routing';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';
import { IResponse } from '../../Interfaces';
import { BlogService } from '../../Services/Blog/BlogService';
import { RolesService } from '../../Services/Roles/RolesService';
import { UserService } from '../../Services/User/UserService';
import { NotificationService } from '../../Services/User/NotificationService';

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

  @Patch('/article/:articleId', [AuthService.authenticate])
  async updateArticle(): Promise<IResponse> {
    if (isNaN(param('articleId'))) {
      return respond({ error: 'Invalid article id.' }, 400);
    }

    try {
      const article: any = await BlogService.getSingleArticle();
      if (!RolesService.isUserAdmin && UserService.getUserId !== article.userId) {
        return respond({ error: 'You cannot delete this blog article.' }, 400);
      }
      await BlogService.updateBlogArticle();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ m: 'Blog edited...' }, 200);
  }

  @Delete('/article/:articleId', [AuthService.authenticate])
  async deleteArticle(): Promise<IResponse> {
    if (isNaN(param('articleId'))) {
      return respond({ error: 'Invalid article id.' }, 400);
    }

    try {
      const article: any = await BlogService.getSingleArticle();
      if (!RolesService.isUserAdmin && UserService.getUserId !== article.userId) {
        return respond({ error: 'You cannot delete this blog article.' }, 400);
      }
      await BlogService.deleteBlogArticle();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ m: 'Blog deleted...' }, 200);
  }

  @Post('/article/vote/:articleId', [AuthService.authenticate])
  async voteArticle(): Promise<IResponse> {
    if (isNaN(param('articleId'))) {
      return respond({ error: 'Invalid article id.' }, 400);
    }

    try {
      await BlogService.insertNewVote();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ m: 'Voted...' }, 200);
  }

  @Post('/article/comment/:articleId', [AuthService.authenticate])
  async postNewComment() {
    if (isNaN(param('articleId'))) {
      return respond({ error: 'Invalid article id.' }, 400);
    }

    if (!request().body('content')) {
      return respond({ error: 'Comment was empty.' }, 401);
    }

    let response;
    try {
      response = await BlogService.insertNewComment();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }

  // this will return an object of the last people that commented
  @Get('/article/:articleId/recentactivity')
  async getArticleRecentActivity(): Promise<IResponse> {
    if (isNaN(param('articleId'))) {
      return respond({ error: 'Invalid article id.' }, 400);
    }

    let response;
    try {
      response = await BlogService.getRecentActivity();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }
}
