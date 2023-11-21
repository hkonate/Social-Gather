import {
  Body,
  Controller,
  Delete,
  Headers,
  Post,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from '../user/dtos/auth.dtos';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { User } from 'src/user/decorators/auth.decorators';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: SignupDTO,
  })
  @ApiConflictResponse({
    description: 'User already exist',
    type: ConflictException,
  })
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
