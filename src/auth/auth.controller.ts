import { Body, Controller, Delete, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from '../user/dtos/auth.dtos';
import { JWTPayloadType } from 'src/guards/auth.guards';
import { User } from 'src/user/decorators/auth.decorators';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignupDTO): Promise<string> {
    return this.authService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SigninDTO): Promise<string> {
    return this.authService.signin(body);
  }

  @Delete()
  deleteToken(
    @User() userPayload: JWTPayloadType,
    @Headers() { authorization }: { authorization: string },
  ) {
    console.log(authorization);
    return this.authService.deleteToken(userPayload.id, authorization);
  }
}
