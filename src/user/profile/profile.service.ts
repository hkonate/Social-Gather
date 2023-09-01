import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
interface UpdateProfileParam {
  bio: string;
  picture: string;
}

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}
  createProfile(userId: string, { bio, picture }: UpdateProfileParam) {
    //todo check if profile already exist
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
}
