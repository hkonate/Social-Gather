import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JoinRoomDto } from './dtos/join-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) {}
  async joinRoom({ userId, eventId }: JoinRoomDto, client: Socket) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        listOfAttendees: true,
      },
    });

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!event) {
      throw new NotFoundException();
    }

    if (!event.listOfAttendees.find((attendee) => attendee.id === userId)) {
      throw new UnauthorizedException();
    }

    for (const room of client.rooms) {
      if (room === eventId) {
        throw new NotAcceptableException();
      }
    }
    const room = client.join(eventId);
    console.log(room);
    client.broadcast
      .to(eventId)
      .emit('newAttendee', { message: `${user.pseudo} a rejoint le chat` });
    client.to(client.id).emit(`Bienvenue dans le chat ${user.pseudo}`);
    return {
      room: eventId,
      attendees: event.listOfAttendees,
    };
  }
  async create({ message, eventId, userId }: Message, client: Socket) {
    console.log(eventId, message);

    await this.prismaService.message.create({
      data: {
        conversation: message,
        authorId: userId,
        eventId,
      },
    });

    client.to(eventId).emit('sendMessage', { message });

    return { room: eventId, message };
  }

  findAll() {
    return `This action returns all messages`;
  }

  typing() {
    return `This action returns message when user typing`;
  }
}
