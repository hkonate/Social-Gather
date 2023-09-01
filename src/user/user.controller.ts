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
import { UpdateUserDTO, UserResponsesDTO } from './dtos/user.dtos';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@User() userPayload: JWTPayloadType): Promise<UserResponsesDTO[]> {
    return this.userService.getUsers(userPayload.id);
  }

  @Get('/:id')
  getUser(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponsesDTO> {
    return this.userService.getUser(id);
  }

  @Put()
  updateUser(
    @User() userPayload: JWTPayloadType,
    @Body() body: UpdateUserDTO,
  ): Promise<UserResponsesDTO> {
    return this.userService.updateUser(userPayload.id, body);
  }

  @Delete()
  deleteUser(@User() userPayload: JWTPayloadType): Promise<void> {
    return this.userService.deleteUser(userPayload.id);
  }
}
