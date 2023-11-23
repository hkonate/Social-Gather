import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InclusionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWTPayloadType } from 'src/guards/auth.guards';
import { EventResponsesDTO } from './dtos/event.dtos';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

interface CreateEventParams {
  title: string;
  description: string;
  schedule: string;
  address: string;
  limit?: string;
  inclusive?: InclusionType[];
}

interface UpdateEvent {
  title?: string;
  description?: string;
  schedule?: string;
  address?: string;
  limit?: string;
  inclusive?: InclusionType[];
}

const eventSelect = {
  id: true,
  title: true,
  description: true,
  schedule: true,
  address: true,
  inclusive: true,
  limit: true,
  images: true,
};

const creatorSelect = {
  id: true,
  pseudo: true,
  phone: true,
  email: true,
};
const select = {
  ...eventSelect,
  creator: {
    select: {
      ...creatorSelect,
    },
  },
  listOfAttendees: {
    select: {
      id: true,
    },
  },
};
@Injectable()
export class EventService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  //Get all events
  async getEvents() {
    try {
      const events = await this.prismaService.event.findMany({
        select,
      });
      return events;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //Get one event
  async getEventById(id: string) {
    try {
      const event = await this.doesEventExists(id);
      return event;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //Create an event
  async createEvent(
    {
      title,
      description,
      schedule,
      inclusive,
      limit,
      address,
    }: CreateEventParams,
    userId: string,
    files: Array<Express.Multer.File>,
  ) {
    const images = [];
    try {
      if (files) {
        for (const file of files) {
          const { secure_url } = await this.cloudinaryService.uploadFile(
            file,
            userId,
            'Event',
          );
          images.push(secure_url);
        }
      }
    } catch (error) {
      throw new UnsupportedMediaTypeException({
        message: error.message,
        statusCode: error.http_code,
      });
    }

    try {
      this.eventTimeRestriction(schedule);
      const createdEvent = await this.prismaService.event.create({
        data: {
          title,
          description,
          schedule,
          ...(inclusive && { inclusive }),
          ...(images.length > 0 && { images }),
          ...(limit && { limit }),
          address,
          listOfAttendees: {
            connect: {
              id: userId,
            },
          },
          creatorId: userId,
          chat: {
            create: {
              conversation:
                'Nous valorisons la bienveillance et le respect mutuel dans cette chat chat. Veuillez contribuer à créer un environnement positif pour toutes et tous les participant(e)s. 🌟',
              authorId: userId,
            },
          },
        },
        select,
      });
      return createdEvent;
    } catch (error) {
      if (images.length > 0) {
        try {
          await this.cloudinaryService.deleteFiles(userId, 'Event');
        } catch (error) {
          throw new UnprocessableEntityException({
            message:
              'Error throw create/update profile and could not delete file that has been create to cloudinary.',
          });
        }
      }
      throw new HttpException(error.message, error.status);
    }
  }

  //Join/Unjoin an event
  async attendEvent(id: string, attend: boolean, userPayload: JWTPayloadType) {
    //todo add checker that block event's attend at a time
    try {
      const { limit, listOfAttendees, creator, schedule } =
        await this.doesEventExists(id);
      this.eventTimeRestriction(schedule);

      if (creator.id === userPayload.id)
        throw new UnauthorizedException(
          'The creator of the event is not allow to join or unjoin the event',
        );
      if (listOfAttendees.length >= parseInt(limit) && attend) {
        throw new UnauthorizedException(
          'Event reach attendees limit, you cannot attend it.',
        );
      }
      const updatedEvent = await this.prismaService.event.update({
        where: {
          id,
        },
        data: {
          listOfAttendees: attend
            ? { connect: { id: userPayload.id } }
            : { disconnect: { id: userPayload.id } },
        },
        select,
      });
      return updatedEvent;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //Update an event
  async updateEventById(
    id: string,
    userId: string,
    { title, description, schedule, inclusive, limit, address }: UpdateEvent,
    files: Array<Express.Multer.File>,
  ): Promise<EventResponsesDTO> {
    const images = [];
    try {
      if (files) {
        await this.cloudinaryService.deleteFiles(userId, 'Event');
        for (const file of files) {
          const { secure_url } = await this.cloudinaryService.uploadFile(
            file,
            userId,
            'Event',
          );
          images.push(secure_url);
        }
      }
    } catch (error) {
      throw new UnsupportedMediaTypeException({
        message: error.message,
        statusCode: error.http_code,
      });
    }
    try {
      const event = await this.doesUserHasAuthorization(id, userId);
      this.eventTimeUpdateRestricction(event.schedule);
      const updatedEvent = await this.prismaService.event.update({
        where: {
          id,
        },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(schedule && { schedule }),
          ...(inclusive && { inclusive }),
          ...(limit && { limit }),
          ...(address && { address }),
          ...(images.length > 0 && { images }),
        },
        select,
      });
      return updatedEvent;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //Delete an event
  async deleteEventById(
    id: string,
    userId: string,
  ): Promise<EventResponsesDTO> {
    try {
      await this.doesUserHasAuthorization(id, userId);
      await this.prismaService.message.deleteMany({
        where: {
          eventId: id,
        },
      });
      const deletedEvent = await this.prismaService.event.delete({
        where: {
          id,
        },
        select,
      });
      await this.cloudinaryService.deleteFiles(userId, 'Event');
      return deletedEvent;
    } catch (error) {
      throw new UnprocessableEntityException({
        message: 'Error appeared during the process of delete event',
      });
    }
  }

  private async doesEventExists(eventId: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id: eventId },
      select,
    });
    if (!event) {
      throw new NotFoundException('That event does not exist');
    }
    return event;
  }

  private async doesUserHasAuthorization(eventId: string, userId: string) {
    const event = await this.doesEventExists(eventId);
    if (event.creator.id !== userId) {
      throw new UnauthorizedException('You are not the owner of the event.');
    }
    return event;
  }

  private eventTimeRestriction(eventTime: string) {
    const tenMinutesAgo = new Date().getTime() * 10 * 60 * 1000;
    const eventDate = new Date(eventTime).getTime();
    if (tenMinutesAgo >= eventDate) {
      throw new UnauthorizedException(
        'You are not allow to create or join/unjoin an event whithin a short time.',
      );
    }
  }

  private eventTimeUpdateRestricction(eventTime: string) {
    const threeHoursAgo = new Date().getTime() * 3 * 60 * 1000;
    const eventDate = new Date(eventTime).getTime();
    if (threeHoursAgo >= eventDate) {
      throw new UnauthorizedException(
        'You are not allow to update an event within a short time.',
      );
    }
  }
}
