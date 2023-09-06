import { Injectable } from '@nestjs/common';
import { EventService } from 'src/event/event.service';
import { PrismaService } from 'src/prisma/prisma.service';

const chatSelector = {
  id: true,
  conversation: true,
  authroId: {
    select: {
      id: true,
      pseudo: true,
      phone: true,
    },
  },
  eventId: true,
};
@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventService: EventService,
  ) {}

  async getMessages(eventId: string) {
    await this.eventService.getEventById(eventId);
    const chat = this.prismaService.message.findMany({
      where: {
        eventId,
      },
      select: {
        ...chatSelector,
      },
    });
    if (!chat) {
      return [];
    }
    return chat;
  }
}
