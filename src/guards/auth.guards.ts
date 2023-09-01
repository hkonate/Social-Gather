import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

export interface JWTPayloadType {
  name: string;
  id: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split('Bearer ')[1];
    try {
      const payload = jwt.verify(
        token,
        process.env.JSON_TOKEN_KEY,
      ) as JWTPayloadType;
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
      });
      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
