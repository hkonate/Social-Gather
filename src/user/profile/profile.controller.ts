import {
  Controller,
  UseGuards,
  Post,
  Body,
  ParseUUIDPipe,
  Param,
  Get,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/user/decorators/auth.decorators';
import {
  ProfileResponsesDTO,
  UpdateProfileDTO,
} from 'src/user/dtos/profile.dtos';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @Get('/:id')
  getProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProfileResponsesDTO> {
    return this.profileService.getProfile(id);
  }

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayload: JWTPayloadType,
    @Body() body: UpdateProfileDTO,
  ): Promise<ProfileResponsesDTO> {
    return this.profileService.updateProfile(userPayload.id, body, file);
  }
}
