import { Controller, Post, Get, Delete, Put, Body } from '@nestjs/common';
import { CreateEventDTO } from './dtos/event.dtos';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  createEvent(@Body() body: CreateEventDTO) {
    return this.eventService.createEvent(body);
  }
}
