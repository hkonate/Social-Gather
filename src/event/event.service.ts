import { Injectable } from '@nestjs/common';
import { InclusionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateEventParams {
  title: string;
  description: string;
  schedule: string;
  inclusive: InclusionType[];
}
@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}
  //Get all events
  getEvents() {
    return this.prismaService.event.findMany();
  }
  //Get one event

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
    });
  }
  //Join/Unjoin an event

  //Update an event

  //Delete an event
}
