import {
  Controller,
  UseGuards,
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
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
@ApiTags('Profile')
@Controller('profile')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Forbidden resource' })
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiFoundResponse({
    description: "Founded user's profile object as response",
    type: ProfileResponsesDTO,
  })
  @ApiUnprocessableEntityResponse({ description: 'Could not process query' })
  @ApiNotFoundResponse({ description: 'That profile does not exist' })
  @ApiParam({ name: 'id', example: '7a9a72da-7e90-4fdf-9b1c-a7ea25af34d7' })
  @Get('/:id')
  getProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProfileResponsesDTO> {
    return this.profileService.getProfile(id);
  }

  @ApiOkResponse({
    description: "Created or Updated user's profile object as response",
    type: ProfileResponsesDTO,
  })
  @ApiUnsupportedMediaTypeResponse({
    description: "Does not support file's type",
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Error throw create/update profile and could not delete file that has been create to cloudinary.',
  })
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
