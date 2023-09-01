import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
interface SignupParams {
  firstname: string;
  lastname: string;
  pseudo: string;
  phone?: string;
  email: string;
  password: string;
  picture?: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

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
    if (userExist) {
      throw new ConflictException();
    }
    const pseudoExist = await this.prismaService.user.findUnique({
      where: {
        pseudo,
      },
    });
    if (pseudoExist) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS),
    );
    const user = await this.prismaService.user.create({
      data: {
        firstname,
        lastname,
        pseudo,
        phone,
        email,
        password: hashedPassword,
        picture,
      },
    });
    return this.generateJWT(user.pseudo, user.id);
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException('invalid credential', 400);
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    return this.generateJWT(user.pseudo, user.id);
  }

  private generateJWT(name: string, id: string) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 3600000,
      },
    );
  }
}
