import {
  Injectable,
  ConflictException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {
  DeleteResponseDTO,
  SigninResponseDTO,
  SignupResponseDto,
} from 'src/user/dtos/auth.dtos';
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
  }: SignupParams): Promise<SignupResponseDto> {
    try {
      const userExist = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (userExist) {
        throw new ConflictException('User already exist');
      }
      const pseudoExist = await this.prismaService.user.findUnique({
        where: {
          pseudo,
        },
      });
      if (pseudoExist) {
        throw new ConflictException('Pseudo already used');
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
          password: true,
          authTokens: true,
        },
      });
      if (!user) {
        throw new HttpException('invalid credential', 400);
      }
      const isCorrect = await bcrypt.compare(password, user.password);
      if (isCorrect) {
        const token = this.generateJWT(user.pseudo, user.id);
        const updatedUser = await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            authTokens: [...user.authTokens, token],
          },
        });
        return updatedUser;
      } else {
        throw new HttpException('invalid credential', 400);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async signin({ email, password }: SigninParams): Promise<SigninResponseDTO> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          pseudo: true,
          phone: true,
          email: true,
          password: true,
          authTokens: true,
        },
      });
      if (!user) {
        throw new HttpException('invalid credential', 400);
      }
      const isCorrect = await bcrypt.compare(password, user.password);
      if (isCorrect) {
        const token = this.generateJWT(user.pseudo, user.id);
        const updatedUser = await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            authTokens: [...user.authTokens, token],
          },
        });
        return updatedUser;
      } else {
        throw new HttpException('invalid credential', 400);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteToken(
    userId: string,
    userBearerToken: string,
  ): Promise<DeleteResponseDTO> {
    try {
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
      return deleteToken;
    } catch (error) {
      throw new UnprocessableEntityException(error.message, error.status);
    }
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
