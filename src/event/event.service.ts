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

  //Get one event

  //Create an event
  createEvent({ title, description, schedule, inclusive }: CreateEventParams) {
    return this.prismaService.event.create({
      data: {
        title,
        description,
        schedule,
        inclusive,
        creatorId: 'fc2f8777-27a1-4248-9ce5-4f963d81d203',
      },
    });
  }
  //Join/Unjoin an event

  //Update an event

  //Delete an event
}
