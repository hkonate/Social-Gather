import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventService } from 'src/event/event.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [PrismaModule, EventModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
