import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JWTPayloadType } from 'src/guards/auth.guards';

export const User = createParamDecorator(
  (data, context: ExecutionContext): JWTPayloadType | null => {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);

    return request?.user;
  },
);
