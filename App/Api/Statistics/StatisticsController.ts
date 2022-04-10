import { Controller, Get } from '../../Core/Decorators';
import { respond } from '../../Core/Routing';
import { IResponse } from '../../Interfaces';
import { StatisticsService } from '../../Services/Statistics/StatisticsService';

@Controller('/stats')
export class StatisticsController {
  @Get('/category')
  async functionGetCategoryStats(): Promise<IResponse> {
    let response;
    try {
      response = await StatisticsService.getCategoryStats();
    } catch (error) {
      console.error(error);
      return respond({ error }, 400);
    }

    return respond({ response }, 200);
  }
}
