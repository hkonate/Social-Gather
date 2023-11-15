import {
  Controller,
  UseGuards,
  Post,
  Body,
  UnsupportedMediaTypeException,
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
  CreateProfileDTO,
  ProfileResponsesDTO,
  UpdateProfileDTO,
} from 'src/user/dtos/profile.dtos';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @Get('/:id')
  getProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProfileResponsesDTO> {
    return this.profileService.getProfile(id);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    // @Param('id', ParseUUIDPipe) id: string,
    @User() userPayload: JWTPayloadType,
    // @Body() body: UpdateProfileDTO,
  ) {
    //  ): Promise<ProfileResponsesDTO> {
    try {
      const toto = await this.cloudinaryService.uploadFile(
        file,
        userPayload.id,
      );
      console.log(toto);
    } catch (error) {
      throw new UnsupportedMediaTypeException({
        message: error.message,
        statusCode: error.http_code,
      });
    }

    return 'toto';
    // return this.profileService.updateProfile(id, userPayload.id, body, file);
  }
}
