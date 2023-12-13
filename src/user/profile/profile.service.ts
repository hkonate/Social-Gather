import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

interface UpdateProfileParam {
  bio?: string;
  hobbies?: string;
}

interface ProfileServiceResponses {
  id: string;
  bio: string;
  picture: string;
  hobbies: string;
  user: {
    id: string;
    pseudo: string;
    phone: string;
    email: string;
  };
}

const profileSelect = {
  id: true,
  bio: true,
  picture: true,
  hobbies: true,
  user: {
    select: {
      id: true,
      pseudo: true,
      phone: true,
      email: true,
    },
  },
};

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

 async getProfile(id: string): Promise<ProfileServiceResponses> {
    const profile = await this.doesProfileExists(id);
    if (!profile) {
      throw new NotFoundException('That profile does not exist');
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    { bio, hobbies }: UpdateProfileParam,
    file: Express.Multer.File,
  ): Promise<ProfileServiceResponses> {
    let imageDetails = null;
    try {
      if (file) {
        await this.cloudinaryService.deleteFiles(userId, 'Avatar');
        imageDetails = await this.cloudinaryService.uploadFile(
          file,
          userId,
          'Avatar',
        );
      }
    } catch (error) {
      throw new UnsupportedMediaTypeException({
        message: error.message,
        statusCode: error.http_code,
      });
    }
    try {
      const picture = imageDetails?.secure_url;
      const existingProfile = await this.prismaService.profile.findUnique({
        where: {
          userId: userId,
        },
      });
      if (!existingProfile) {
        const createdProfile = await this.prismaService.profile.create({
          data: {
            ...(bio && { bio }),
            ...(picture && { picture }),
            ...(hobbies && { hobbies }),
            user: {
              connect: {
                id: userId,
              },
            },
          },
          select: {
            ...profileSelect,
          },
        });
        return createdProfile;
      } else {
        const updatedProfile = await this.prismaService.profile.update({
          where: {
            userId,
          },
          data: {
            ...(bio && { bio }),
            ...(picture && { picture }),
            ...(hobbies && { hobbies }),
          },
          select: {
            ...profileSelect,
          },
        });
        return updatedProfile;
      }
    } catch (error) {
      if (imageDetails) {
        try {
          await this.cloudinaryService.deleteFile(imageDetails.public_id);
        } catch (error) {
          throw new UnprocessableEntityException({
            message:
              'Error throw create/update profile and could not delete file that has been create to cloudinary.',
          });
        }
      }
      throw new HttpException(error.message, error.status);
    }
  }

  private async doesProfileExists(
    userId: string,
  ): Promise<ProfileServiceResponses> {
    try {
      const profile = await this.prismaService.profile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          ...profileSelect,
        },
      });
      if (!profile) {
        return null;
      }
      return profile;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
