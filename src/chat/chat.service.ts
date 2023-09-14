import { Injectable, NotFoundException } from '@nestjs/common';
import { EventService } from 'src/event/event.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMessagesResponseDto } from './dtos/chat.dtos';

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

  async getMessages(eventId: string): Promise<GetMessagesResponseDto[]> {
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
      throw new NotFoundException();
    }
    return chat;
  }
}
