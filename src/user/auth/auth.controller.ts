import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, SignupParams } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  signup(@Body() body: SignupParams) {
    return this.authService.signup(body);
  }
}
