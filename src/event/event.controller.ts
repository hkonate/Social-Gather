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
import {
  CreateEventDTO,
  EventResponsesDTO,
  UpdateEventDTO,
} from './dtos/event.dtos';
import { EventService } from './event.service';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { User } from 'src/user/decorators/auth.decorators';

@Controller('event')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Get()
  getEvents(): Promise<EventResponsesDTO[]> {
    return this.eventService.getEvents();
  }

  @Get('/:id')
  getEventById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EventResponsesDTO> {
    return this.eventService.getEventById(id);
  }

  @Post()
  createEvent(
    @Body() body: CreateEventDTO,
    @User() userPayload: JWTPayloadType,
  ): Promise<EventResponsesDTO> {
    return this.eventService.createEvent(body, userPayload.id);
  }

  @Put('/:id')
  updateEventById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEventDTO,
    @User() userPayload: JWTPayloadType,
  ): Promise<EventResponsesDTO> {
    return this.eventService.updateEventById(id, userPayload.id, body);
  }

  @Put('/:id/:attend')
  attendEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('attend', ParseBoolPipe) attend: boolean,
    @User() userPayload: JWTPayloadType,
  ): Promise<EventResponsesDTO> {
    return this.eventService.attendEvent(id, attend, userPayload);
  }

  @Delete('/:id')
  deleteEventById(
    @Param('id', ParseUUIDPipe) id: string,
    @User() userPayload: JWTPayloadType,
  ): Promise<void> {
    return this.eventService.deleteEventById(id, userPayload.id);
  }
}
