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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateEventDTO,
  EventResponsesDTO,
  UpdateEventDTO,
} from './dtos/event.dtos';
import { EventService } from './event.service';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { User } from 'src/user/decorators/auth.decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
//ds
@ApiTags('Event')
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
  @UseInterceptors(FilesInterceptor('files'))
  createEvent(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: CreateEventDTO,
    @User() userPayload: JWTPayloadType,
  ): Promise<EventResponsesDTO> {
    return this.eventService.createEvent(body, userPayload.id, files);
  }

  @Put('/:id')
  @UseInterceptors(FilesInterceptor('files'))
  updateEventById(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEventDTO,
    @User() userPayload: JWTPayloadType,
  ): Promise<EventResponsesDTO> {
    return this.eventService.updateEventById(id, userPayload.id, body, files);
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
  ) {
    return this.eventService.deleteEventById(id, userPayload.id);
  }
}
