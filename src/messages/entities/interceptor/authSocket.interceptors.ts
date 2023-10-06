import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

export class AuthSocketInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = request?.handshake?.auth?.token?.split('Bearer ')[1];
    const user = jwt.decode(token);
    request.user = user;
    return handler.handle();
  }
}
