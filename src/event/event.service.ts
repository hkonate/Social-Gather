import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateEventParams {
  title: string;
  description: string;
  schedule: string;
}
@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}
  //Get all events

  //Get one event

  //Create an event
  async createEvent() {}
  //Join/Unjoin an event

  //Update an event

  //Delete an event
}
