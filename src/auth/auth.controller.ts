import {
  Body,
  Controller,
  Delete,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from '../user/dtos/auth.dtos';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { User } from 'src/user/decorators/auth.decorators';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignupDTO) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SigninDTO) {
    return this.authService.signin(body);
  }

  @UseGuards(AuthGuard)
  @Delete()
  deleteToken(
    @User() userPayload: JWTPayloadType,
    @Headers() { authorization }: { authorization: string },
  ) {
    console.log(authorization);
    return this.authService.deleteToken(userPayload.id, authorization);
  }
}
