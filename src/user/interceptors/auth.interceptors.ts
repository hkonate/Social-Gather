import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log(request?.headers);

    const token = request?.headers?.authorization?.split('Bearer ')[1];
    const user = jwt.decode(token);
    request.user = user;
    return handler.handle();
  }
}
