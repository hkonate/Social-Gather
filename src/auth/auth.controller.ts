import {
  Body,
  Controller,
  Delete,
  Headers,
  Post,
  UseGuards,
  ConflictException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  DeleteResponseDTO,
  SigninDTO,
  SigninResponseDTO,
  SignupDTO,
  SignupResponseDto,
} from '../user/dtos/auth.dtos';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { User } from 'src/user/decorators/auth.decorators';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: SignupResponseDto,
  })
  @ApiConflictResponse({
    description: 'User already exist',
  })
  @ApiConflictResponse({
    description: 'Pseudo already used',
  })
  @HttpCode(201)
  @Post('/signup')
  signup(@Body() body: SignupDTO): Promise<SignupResponseDto> {
    return this.authService.signup(body);
  }

  @ApiOkResponse({
    description: "Created JsonWebToken and user's ID in object as response",
    type: SigninResponseDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid credential' })
  @HttpCode(201)
  @Post('/signin')
  signin(@Body() body: SigninDTO): Promise<SigninResponseDTO> {
    return this.authService.signin(body);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deleted user object as response',
    type: DeleteResponseDTO,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Delete operation has not been complete',
  })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @Delete()
  deleteToken(
    @User() userPayload: JWTPayloadType,
    @Headers() { authorization }: { authorization: string },
  ): Promise<DeleteResponseDTO> {
    return this.authService.deleteToken(userPayload.id, authorization);
  }
}
