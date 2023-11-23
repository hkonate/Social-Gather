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
  HttpCode,
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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { InclusionType } from '@prisma/client';
//ds
@ApiTags('Event')
@Controller('event')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @ApiFoundResponse({
    description: 'Founded an array of events object as response',
    type: [EventResponsesDTO],
  })
  @HttpCode(302)
  @Get()
  getEvents(): Promise<EventResponsesDTO[]> {
    return this.eventService.getEvents();
  }

  @ApiFoundResponse({
    description: 'Founded an event object as response',
    type: EventResponsesDTO,
  })
  @HttpCode(302)
  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the event',
    example: '269141d9-0f3c-452b-a0b1-9fab89b68f57',
  })
  getEventById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EventResponsesDTO> {
    return this.eventService.getEventById(id);
  }

  @ApiCreatedResponse({
    description: 'Created an event object as response',
    type: EventResponsesDTO,
  })
  @HttpCode(201)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  createEvent(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: CreateEventDTO,
    @User() userPayload: JWTPayloadType,
  ): Promise<EventResponsesDTO> {
    return this.eventService.createEvent(body, userPayload.id, files);
  }

  @ApiOkResponse({
    description: 'Updated an event object as response',
    type: EventResponsesDTO,
  })
  @ApiQuery({
    name: 'title',
    type: 'string',
    example: 'Quick',
    required: false,
  })
  @ApiQuery({
    name: 'inclusive',
    type: '[InclusionType]',
    example: ['HALAL', 'STANDARD'],
    required: false,
  })
  @HttpCode(200)
  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the event',
    example: '269141d9-0f3c-452b-a0b1-9fab89b68f57',
  })
  @UseInterceptors(FilesInterceptor('files'))
  updateEventById(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEventDTO,
    @User() userPayload: JWTPayloadType,
  ): Promise<EventResponsesDTO> {
    return this.eventService.updateEventById(id, userPayload.id, body, files);
  }

  @ApiOkResponse({
    description:
      'Updated the list of attendees for an event object as a response',
    type: EventResponsesDTO,
  })
  @HttpCode(200)
  @Put('/:id/:attend')
  attendEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('attend', ParseBoolPipe) attend: boolean,
    @User() userPayload: JWTPayloadType,
  ): Promise<EventResponsesDTO> {
    return this.eventService.attendEvent(id, attend, userPayload);
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Deleted event object as response',
    type: EventResponsesDTO,
  })
  @HttpCode(200)
  deleteEventById(
    @Param('id', ParseUUIDPipe) id: string,
    @User() userPayload: JWTPayloadType,
  ): Promise<EventResponsesDTO> {
    return this.eventService.deleteEventById(id, userPayload.id);
  }
}
