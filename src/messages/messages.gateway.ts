import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { ParseUUIDPipe, ParseBoolPipe, UseGuards } from '@nestjs/common';
import { SocketGuard } from 'src/guards/authSocket.guards';
import { User } from 'src/user/decorators/auth.decorators';
import { JWTPayloadType } from 'src/guards/auth.guards';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(SocketGuard)
export class MessagesGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody('eventId', ParseUUIDPipe) eventId: string,
    @User() userPayload: JWTPayloadType,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.joinRoom(userPayload.id, eventId, client);
  }

  @SubscribeMessage('createMessage')
  create(
    @MessageBody() createMessage: CreateMessageDto,
    @User() userPayload: JWTPayloadType,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.create(userPayload.id, createMessage, client);
  }

  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody('eventId', ParseUUIDPipe) eventId: string) {
    return this.messagesService.findAll(eventId);
  }

  @SubscribeMessage('typing')
  typing(
    @User() userPayload: JWTPayloadType,
    @MessageBody('eventId', ParseUUIDPipe) eventId: string,
    @MessageBody('isTyping', ParseBoolPipe) isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.typing(
      userPayload.id,
      eventId,
      isTyping,
      client,
    );
  }
}
