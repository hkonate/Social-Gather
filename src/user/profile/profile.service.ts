import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
  ForbiddenException,
  HttpStatus,
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

  getProfile(id: string): Promise<ProfileServiceResponses> {
    const profile = this.doesProfileExists(id);
    if (!profile) {
      throw new NotFoundException('That profile does not exist');
    }
    return profile;
  }

  async updateProfile(
    profileId: string,
    userId: string,
    { bio, hobbies }: UpdateProfileParam,
    file: Express.Multer.File,
  ): Promise<ProfileServiceResponses> {
    let picture = null;
    try {
      const imageDetails = await this.cloudinaryService.uploadFile(
        file,
        userId,
      );
      console.log(imageDetails);

      picture = imageDetails.secure_url;
    } catch (error) {
      throw new UnsupportedMediaTypeException({
        message: error.message,
        statusCode: error.http_code,
      });
    }

    try {
      const profile = await this.doesProfileExists(profileId);
      if (profile) {
        if (profile.user.id !== userId) {
          throw new UnauthorizedException(
            'You can only update your own profile',
          );
        }
        const updatedProfile = await this.prismaService.profile.update({
          where: {
            userId,
          },
          data: {
            bio,
            picture,
            hobbies,
          },
          select: {
            ...profileSelect,
          },
        });
        return updatedProfile;
      } else {
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
          console.log(createdProfile, 'createdProfile');

          return createdProfile;
        } else {
          throw new ForbiddenException({
            message: 'User cannot have multiple profile',
          });
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  private async doesProfileExists(
    profileId: string,
  ): Promise<ProfileServiceResponses> {
    try {
      const profile = await this.prismaService.profile.findUnique({
        where: {
          id: profileId,
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
