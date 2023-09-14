import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InclusionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWTPayloadType } from 'src/guards/auth.guards';

interface CreateEventParams {
  title: string;
  description: string;
  schedule: string;
  address: string;
  menu?: string;
  limit?: string;
  inclusive: InclusionType[];
}

interface UpdateEvent {
  title?: string;
  description?: string;
  schedule?: string;
  address?: string;
  menu?: string;
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
  menu: true,
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
  constructor(private readonly prismaService: PrismaService) {}
  //Get all events
  getEvents() {
    return this.prismaService.event.findMany({
      select,
    });
  }
  //Get one event
  getEventById(id: string) {
    return this.doesEventExists(id);
  }
  //Create an event
  async createEvent(
    {
      title,
      description,
      schedule,
      inclusive,
      menu,
      limit,
      address,
    }: CreateEventParams,
    userId: string,
  ) {
    return this.prismaService.event.create({
      data: {
        title,
        description,
        schedule,
        inclusive,
        ...(menu && { menu }),
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
  }

  //Join/Unjoin an event
  async attendEvent(id: string, attend: boolean, userPayload: JWTPayloadType) {
    //todo add checker that block event's attend at a time
    await this.doesEventExists(id);
    const { limit, listOfAttendees, creator } = await this.getEventById(id);
    if (creator.id === userPayload.id) throw new UnauthorizedException();
    if (attend) {
      if (listOfAttendees.length < parseInt(limit))
        return this.prismaService.event.update({
          where: {
            id,
          },
          data: {
            listOfAttendees: {
              connect: {
                id: userPayload.id,
              },
            },
          },
          select,
        });
      throw new UnauthorizedException();
    } else {
      return this.prismaService.event.update({
        where: {
          id,
        },
        data: {
          listOfAttendees: {
            disconnect: {
              id: userPayload.id,
            },
          },
        },
        select,
      });
    }
  }
  //Update an event
  async updateEventById(id: string, userId: string, data: UpdateEvent) {
    await this.doesUserHasAuthorization(id, userId);
    return this.prismaService.event.update({
      where: {
        id,
      },
      data,
      select,
    });
  }
  //Delete an event
  async deleteEventById(id: string, userId: string) {
    await this.doesUserHasAuthorization(id, userId);
    await this.prismaService.message.deleteMany({
      where: {
        eventId: id,
      },
    });
    await this.prismaService.event.delete({
      where: {
        id,
      },
      select,
    });
  }
  private async doesEventExists(eventId: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id: eventId },
      select,
    });
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  private async doesUserHasAuthorization(eventId: string, userId: string) {
    const event = await this.doesEventExists(eventId);
    if (event.creator.id !== userId) {
      throw new UnauthorizedException();
    }
  }
}
