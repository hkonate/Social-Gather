import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { select } from 'src/user/user.service';
import { ProfileResponsesDTO } from '../dtos/profile.dtos';
interface CreateProfileParam {
  bio?: string;
  picture?: string;
  hobbies?: string;
}

interface UpdateProfileParam {
  bio?: string;
  picture?: string;
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
  constructor(private readonly prismaService: PrismaService) {}
  async createProfile(
    userId: string,
    { bio, picture, hobbies }: CreateProfileParam,
  ): Promise<ProfileResponsesDTO> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select,
    });
    if (!user || user.profile !== null) {
      throw new UnauthorizedException();
    }
    return this.prismaService.profile.create({
      data: {
        bio,
        picture,
        hobbies,
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

  async getProfile(id: string): Promise<ProfileServiceResponses> {
    return this.doesProfileExists(id);
  }

  async updateProfile(
    id: string,
    userId: string,
    data: UpdateProfileParam,
  ): Promise<ProfileServiceResponses> {
    const profile = await this.doesProfileExists(id);

    if (profile.user.id !== userId) {
      throw new UnauthorizedException();
    }
    return this.prismaService.profile.update({
      where: {
        id,
      },
      data,
      select: {
        ...profileSelect,
      },
    });
  }

  private async doesProfileExists(
    profileId: string,
  ): Promise<ProfileServiceResponses> {
    const profile = await this.prismaService.profile.findUnique({
      where: {
        id: profileId,
      },
      select: {
        ...profileSelect,
      },
    });
    if (!profile) {
      throw new NotFoundException();
    }
    return profile;
  }
}
