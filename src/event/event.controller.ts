import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { CreateEventDTO } from './dtos/event.dtos';
import { EventService } from './event.service';

@Controller('event')
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

  @Delete('/:id')
  deleteEventById(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.deleteEventById(id);
  }
}
