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

  async getProfile() {}
}
