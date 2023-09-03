import {
  Controller,
  UseGuards,
  Post,
  Body,
  ParseUUIDPipe,
  Param,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/user/decorators/auth.decorators';
import {
  UpdateProfileDTO,
  ProfileResponsesDTO,
} from 'src/user/dtos/profile.dtos';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Post()
  createProfile(
    @User() userPayload: JWTPayloadType,
    @Body() body: UpdateProfileDTO,
  ): Promise<ProfileResponsesDTO> {
    return this.profileService.createProfile(userPayload.id, body);
  }

  @Get('/:id')
  getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.getProfile(id);
  }
}
