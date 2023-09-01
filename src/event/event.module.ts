import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../guards/auth.guards';

@Module({
  imports: [PrismaModule],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
