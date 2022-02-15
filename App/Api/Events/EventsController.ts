import { Controller, Get } from '../../Core/Decorators';

@Controller('/events')
export class EventsController {
  // Get all user related events
  @Get('/all')
  async getAllEvents() {

  }
}
