import { Module } from '@nestjs/common';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
@Module({
  imports: [PrismaModule],
  controllers: [UserController, AuthController, ProfileController],
  providers: [UserService, AuthService, ProfileService],
  exports: [UserModule],
})
export class UserModule {}
