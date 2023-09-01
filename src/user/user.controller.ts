import {
  Controller,
  UseGuards,
  Get,
  Delete,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { UserService } from './user.service';
import { User } from './decorators/auth.decorators';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@User() userPayload: JWTPayloadType) {
    return this.userService.getUsers(userPayload.id);
  }

  @Get('/:id')
  GetUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUser(id);
  }
}
