import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JWTPayloadType } from 'src/guards/auth.guards';

export const User = createParamDecorator();
