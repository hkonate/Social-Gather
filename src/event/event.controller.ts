import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  ParseUUIDPipe,
  Param,
  ParseBoolPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateEventDTO } from './dtos/event.dtos';
import { EventService } from './event.service';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { User } from 'src/user/decorators/auth.decorators';

@Controller('event')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Get()
  getEvents() {
    return this.eventService.getEvents();
  }

  @Get('/:id')
  getEventById(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.getEventById(id);
  }

  @Post()
  createEvent(@Body() body: CreateEventDTO) {
    return this.eventService.createEvent(body);
  }

  @Put('/:id/:attend')
  attendEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('attend', ParseBoolPipe) attend: boolean,
    @User() userPayload: JWTPayloadType,
  ) {
    console.log(userPayload, 'controller');

    return this.eventService.attendEvent(id, attend, userPayload);
  }

  @Delete('/:id')
  deleteEventById(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.deleteEventById(id);
  }
}
