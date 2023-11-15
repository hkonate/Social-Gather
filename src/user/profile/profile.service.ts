import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
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
      throw new NotFoundException();
    }
    return profile;
  }

  async updateProfile(
    id: string,
    userId: string,
    { bio, hobbies }: UpdateProfileParam,
    file: Express.Multer.File,
  ): Promise<ProfileServiceResponses> {
    let picture = null;
    try {
      const response = await this.cloudinaryService.uploadFile(file, userId);
      picture = response.secure_url;
    } catch (error) {
      throw new UnsupportedMediaTypeException({
        message: error.message,
        statusCode: error.http_code,
      });
    }

    try {
      const profile = await this.doesProfileExists(id);
      if (profile) {
        if (profile.user.id !== userId) {
          throw new UnauthorizedException();
        }
        return this.prismaService.profile.update({
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
      } else {
        return this.prismaService.profile.create({
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
      }
    } catch (error) {
      throw new UnprocessableEntityException(error);
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
