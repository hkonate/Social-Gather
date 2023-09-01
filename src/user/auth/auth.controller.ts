import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from '../dtos/auth.dtos';

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
}
