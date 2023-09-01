import { Module, UseGuards } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { ChatModule } from './chat/chat.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptor } from './user/interceptors/auth.interceptors';

@Module({
  imports: [PrismaModule, UserModule, EventModule, ChatModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
})
export class AppModule {}
