import {
  Controller,
  Get,
  ParseUUIDPipe,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';
import { ChatService } from './chat.service';
import { GetMessagesResponseDto } from './dtos/chat.dtos';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get('/:id')
  getMessages(
    @Param('id', ParseUUIDPipe) eventId: string,
  ): Promise<GetMessagesResponseDto[]> {
    return this.chatService.getMessages(eventId);
  }
}
