import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/user/decorators/auth.decorators';
import { UpdateProfileDTO } from 'src/user/dtos/profile.dtos';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Post()
  createProfile(
    @User() userPayload: JWTPayloadType,
    @Body() body: UpdateProfileDTO,
  ) {
    return this.profileService.createProfile(userPayload.id, body);
  }
}
