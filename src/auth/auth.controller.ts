import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from '../user/dtos/auth.dtos';

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
}
