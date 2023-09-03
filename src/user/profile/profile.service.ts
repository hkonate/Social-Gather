import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { select } from 'src/user/user.service';
interface UpdateProfileParam {
  bio: string;
  picture: string;
}

const profileSelect = {
  id: true,
  bio: true,
  picture: true,
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
  async createProfile(userId: string, { bio, picture }: UpdateProfileParam) {
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
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getProfile(id: string) {}

  private async doesProfileExists(id: string) {
    const profile = await this.prismaService.profile.findUnique({
      where: {
        id,
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
