import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {}
