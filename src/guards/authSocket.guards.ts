import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWTPayloadType } from './auth.guards';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request?.handshake?.auth?.token?.split('Bearer ')[1];
    if (!token) {
      return false;
    }
    const payload = jwt.verify(
      token,
      process.env.JSON_TOKEN_KEY,
    ) as JWTPayloadType;

    if (!payload) {
      return false;
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      return false;
    }
    return true;
  }
}
