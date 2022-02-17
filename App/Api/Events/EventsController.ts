import { Controller, Get } from '../../Core/Decorators';
import { AuthenticationService as AuthService } from '../../Services/Auth/AuthenticationService';

@Controller('/events', [AuthService.authenticate])
export class EventsController {
  // Get all user related events
  @Get('/all')
  async getAllEvents() {}
}
