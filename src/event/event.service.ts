import { Injectable, NotFoundException } from '@nestjs/common';
import { InclusionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateEventParams {
  title: string;
  description: string;
  schedule: string;
  inclusive: InclusionType[];
}

const eventSelect = {
  title: true,
  description: true,
  schedule: true,
  inclusive: true,
};

const creatorSelect = {
  pseudo: true,
  phone: true,
  email: true,
  picture: true,
};

const select = {
  ...eventSelect,
  creator: {
    select: {
      ...creatorSelect,
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
  async getEventById(id: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id },
      select,
    });
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }
  //Create an event
  createEvent({ title, description, schedule, inclusive }: CreateEventParams) {
    return this.prismaService.event.create({
      data: {
        title,
        description,
        schedule,
        inclusive,
        creatorId: '108fa9c9-b83f-4de8-8daf-f720a7ee9a97',
      },
      select,
    });
  }

  //Join/Unjoin an event
  attendEvent(id: string, attend: boolean) {}
  //Update an event

  //Delete an event
  async deleteEventById(id: string) {
    await this.prismaService.event.delete({
      where: {
        id,
      },
      select,
    });
  }
}
