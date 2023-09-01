import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const select = {
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
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers(userId: string) {
    const users = await this.prismaService.user.findMany({
      select,
    });
    if (!users) {
      throw new NotFoundException();
    }
    return users.filter((user) => user.id !== userId);
  }

  async getUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select,
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async updateUser(userID: string, body) {}
}

// Peter eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3BpZGVybWFuIiwiaWQiOiJhYzY3ODI1ZS03NDk1LTRjNWUtYjg0MS1iODBkYThkYzMyMWMiLCJpYXQiOjE2OTM1NzgzNjYsImV4cCI6MTY5NzE3ODM2Nn0.7EB5eNVfuru9lUcWsCxqI1zCJ_Pt_fiDZrQ4n9KUqWU
// John  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9obmRvZSIsImlkIjoiZmJjMzg4NzMtZTExNi00NzU3LWJjNzMtYzAwZTlkYTdkNjU4IiwiaWF0IjoxNjkzNTc4NDMxLCJleHAiOjE2OTcxNzg0MzF9.7uXladmqgOgzgzCFwAJ3leBEq-M7Bg2qqx57Xl-Flvk
// lebron eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTGVraW5nIiwiaWQiOiJkZmQ5ZDBhMi1hMGJhLTQ0ZmYtODQ4MS1hMjZjMDM1ZTFmOWMiLCJpYXQiOjE2OTM1Nzg1MjgsImV4cCI6MTY5NzE3ODUyOH0.aBcmAMASWSDansv3UTSUsCTmHzSrWqvRrno2tGbFq6g
// mojojojo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibW9tbyIsImlkIjoiNTk3Mzk1YTMtMTVkMS00ZGNhLTg5NjMtYWIzMmUwNWVmMzcwIiwiaWF0IjoxNjkzNTc4NjEzLCJleHAiOjE2OTcxNzg2MTN9.GNZymjNYuSIn4rRHXlGhbcdVcCjvhUJPZKa9PqJpzaQ
