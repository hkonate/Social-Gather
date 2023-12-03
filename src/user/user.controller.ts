import {
  Controller,
  UseGuards,
  Get,
  Delete,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard, JWTPayloadType } from 'src/guards/auth.guards';
import { UserService } from './user.service';
import { User } from './decorators/auth.decorators';
import { UpdateUserDTO, UserResponsesDTO } from './dtos/user.dtos';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Forbidden resource' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiFoundResponse({
    description: 'Found array of users objects as response',
    type: [UserResponsesDTO],
  })
  @ApiNotFoundResponse({ description: 'Users not found' })
  @ApiUnprocessableEntityResponse({
    description: 'An error occurred',
  })
  @Get()
  getUsers(@User() userPayload: JWTPayloadType): Promise<UserResponsesDTO[]> {
    return this.userService.getUsers(userPayload.id);
  }

  @ApiFoundResponse({
    description: 'Found user object as response',
    type: UserResponsesDTO,
  })
  @ApiUnprocessableEntityResponse({
    description: 'An error occurred',
  })
  @Get('/:id')
  getUser(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponsesDTO> {
    return this.userService.getUser(id);
  }

  @ApiOkResponse({
    description: 'Updated user object as response',
    type: UserResponsesDTO,
  })
  @ApiUnprocessableEntityResponse({
    description: 'An error occurred',
  })
  @Put()
  updateUser(
    @User() userPayload: JWTPayloadType,
    @Body() body: UpdateUserDTO,
  ): Promise<UserResponsesDTO> {
    return this.userService.updateUser(userPayload.id, body);
  }

  @ApiOkResponse({
    description: 'Deleted user object as response',
    type: UserResponsesDTO,
  })
  @ApiUnprocessableEntityResponse({
    description: 'An error occurred',
  })
  @Delete()
  deleteUser(@User() userPayload: JWTPayloadType): Promise<UserResponsesDTO> {
    return this.userService.deleteUser(userPayload.id);
  }
}
