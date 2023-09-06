import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventService } from 'src/event/event.service';

@Module({
  imports: [PrismaService, EventService],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
