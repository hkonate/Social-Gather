import {
  Controller,
  UseGuards,
  Get,
  Delete,
  Post,
  Put,
  Body,
} from '@nestjs/common';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { UserService } from './user.service';
import { User } from './decorators/auth.decorators';
import { UpdateProfileDTO } from './dtos/user.dtos';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@User() userPayload: JWTPayloadType) {
    return this.userService.getUsers(userPayload.id);
  }

  @Post()
  createProfile(
    @User() userPayload: JWTPayloadType,
    @Body() body: UpdateProfileDTO,
  ) {
    console.log(body);

    return this.userService.createProfile(userPayload.id, body);
  }
}
