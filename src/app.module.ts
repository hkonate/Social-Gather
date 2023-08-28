import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [PrismaModule, UserModule, EventModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
