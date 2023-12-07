import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcryptjs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserResponsesDTO } from './dtos/user.dtos';
interface UpdateUserParams {
  firstname?: string;
  lastname?: string;
  pseudo?: string;
  phone?: string;
  email?: string;
  password?: string;
}

export const select = {
  id: true,
  pseudo: true,
  phone: true,
  email: true,
  profile: {
    select: {
      bio: true,
      picture: true,
    },
  },
};
@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getUsers(userId: string) {
    try {
      const users = await this.prismaService.user.findMany({
        where: {
          id: {
            not: userId,
          },
        },
        select,
      });
      if (!users) {
        throw new NotFoundException('Users not found');
      }
      return users;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async getUser(userId: string): Promise<UserResponsesDTO> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select,
      });
      return user;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async updateUser(
    userId: string,
    data: UpdateUserParams,
  ): Promise<UserResponsesDTO> {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(
          data.password,
          process.env.JSON_WEB_KEY,
        );
      }
      const updatedUser = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data,
        select,
      });
      return updatedUser;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async deleteUser(userId: string): Promise<UserResponsesDTO> {
    try {
      const profile = await this.prismaService.profile.findUnique({
        where: { userId },
      });

      if (profile) {
        await this.prismaService.profile.delete({
          where: {
            userId,
          },
        });
      }

      const events = await this.prismaService.event.findMany({
        where: { creatorId: userId },
      });
      if (events.length > 0) {
        for (const event of events) {
          const messages = await this.prismaService.message.findMany({
            where: {
              eventId: event.id,
            },
          });
          if (messages.length > 0) {
            await this.prismaService.message.deleteMany({
              where: {
                eventId: event.id,
              },
            });
          }
        }
        await this.prismaService.event.deleteMany({
          where: { creatorId: userId },
        });
      }

      await this.cloudinaryService.deleteFolders(userId);

      const deletedUser = await this.prismaService.user.delete({
        where: {
          id: userId,
        },
        select,
      });
      return deletedUser;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
