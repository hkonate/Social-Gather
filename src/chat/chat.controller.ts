import {
  Controller,
  Get,
  ParseUUIDPipe,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get('/:id')
  getMessages(@Param('id', ParseUUIDPipe) eventId: string) {
    return this.chatService.getMessages(eventId);
  }
}
