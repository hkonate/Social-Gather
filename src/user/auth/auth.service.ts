import { Injectable, Post, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface SignupParams {
  firstname: string;
  lastname: string;
  pseudo: string;
  phone?: string;
  email: string;
  password: string;
  picture?: string;
}
@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  async signup({
    firstname,
    lastname,
    pseudo,
    phone,
    email,
    password,
    picture,
  }: SignupParams) {
    const userExist = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!userExist) {
      throw new ConflictException();
    }
    const pseudoExist = await this.prismaService.user.findUnique({
      where: {
        pseudo,
      },
    });
    if (!pseudoExist) {
      throw new ConflictException();
    }
    const user = await this.prismaService.user.create({
      data: {
        firstname,
        lastname,
        pseudo,
        phone,
        email,
        password,
        picture,
      },
    });
    console.log(user);
  }
}
