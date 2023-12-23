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
  Query,
  ParseIntPipe,
  ParseEnumPipe,
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
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import {CategoryType, InclusionType} from "@prisma/client"

@ApiTags('Event')
@Controller('event')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Forbidden resource' })
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @ApiFoundResponse({
    description: 'Founded an array of events object as response',
    type: [EventResponsesDTO],
  })
  @ApiQuery({
    name: 'sort',
    type: 'string',
    example: 'asc',
    required: false,
  })
  @ApiQuery({
    name: 'lte',
    type: 'number',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'gte',
    type: 'number',
    example: 16,
    required: false,
  })
  @ApiQuery({
    name: 'inclusive',
    type: '[InclusionType]',
    example: ['HALAL', 'STANDARD'],
    required: false,
  })
  @ApiQuery({
    name: 'equals',
    type: 'CategoryType',
    example: 'RESTAURANT',
    required: false,
  })
  @Get()
  getEvents(
    @Query("sort") sort?: string,
    @Query("lte" ) lte?: number,
    @Query("gte") gte?: number,
    @Query("title") title?: string,
    @Query("equals" ) equals?: CategoryType,
    @Query("inclusive" ) inclusive?: InclusionType[] ,
  ): Promise<EventResponsesDTO[]> {
    console.log(inclusive);
    return this.eventService.getEvents({sort ,lte, gte, equals, inclusive, title});
  }

  
  
  
  @ApiFoundResponse({
    description: 'Founded an event object as response',
    type: EventResponsesDTO,
  })
  @ApiNotFoundResponse({ description: 'That event does not exist' })
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
  @ApiUnsupportedMediaTypeResponse({ description: 'File type not supported' })
  @ApiUnauthorizedResponse({
    description: 'You are not allow to create an event whithin a short time.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Error throw create/update profile and could not delete file that has been create to cloudinary.',
  })
  @HttpCode(201)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { files: 10 } }))
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

  @ApiUnsupportedMediaTypeResponse({
    description: "File's type is not supported",
  })
  @ApiUnauthorizedResponse({
    description: 'You are not the owner of the event.',
  })
  @ApiUnauthorizedResponse({
    description: 'You are not allow to update an event within a short time.',
  })
  @HttpCode(200)
  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the event',
    example: '269141d9-0f3c-452b-a0b1-9fab89b68f57',
  })
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { files: 10 } }))
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
  @ApiFoundResponse({ description: 'That event does not exist' })
  @ApiUnauthorizedResponse({
    description:
      'You are not allow to join/unjoin an event whithin a short time.',
  })
  @ApiUnauthorizedResponse({
    description:
      'The creator of the event is not allow to join or unjoin the event',
  })
  @ApiUnauthorizedResponse({
    description: 'Event reach attendees limit, you cannot attend it.',
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

  @ApiUnauthorizedResponse({
    description: 'You are not the owner of the event.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Error appeared during the process of delete event',
  })
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
