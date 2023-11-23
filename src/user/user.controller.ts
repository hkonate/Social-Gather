import {
  Controller,
  UseGuards,
  Get,
  Delete,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { UserService } from './user.service';
import { User } from './decorators/auth.decorators';
import { UpdateUserDTO, UserResponsesDTO } from './dtos/user.dtos';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Forbidden resource' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: Array<UserResponsesDTO>,
  })
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
  deleteUser(@User() userPayload: JWTPayloadType) {
    return this.userService.deleteUser(userPayload.id);
  }
}
