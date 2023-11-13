import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { log } from 'console';
interface SignupParams {
  firstname: string;
  lastname: string;
  pseudo: string;
  phone?: string;
  email: string;
  password: string;
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
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        pseudo: true,
        email: true,
      },
    });

    return user;
  }

  async signin({ email, password }: SigninParams): Promise<string | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException('invalid credential', 400);
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      const token = this.generateJWT(user.pseudo, user.id);
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          authTokens: [...user.authTokens, token],
        },
      });
      return token;
    } else {
      throw new HttpException('invalid credential', 400);
    }
  }

  async deleteToken(userId: string, userBearerToken: string) {
    const token = userBearerToken.split(' ')[1];
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    const deleteToken = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        authTokens: user.authTokens
          .filter((authToken) => authToken !== token)
          .map((tokenFiltered) => tokenFiltered),
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        pseudo: true,
        email: true,
        authTokens: true,
      },
    });
    console.log(deleteToken);
    return deleteToken;
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
