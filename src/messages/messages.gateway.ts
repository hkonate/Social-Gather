import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { JoinRoomDto } from './dtos/join-room.dto';
import { CreateMessageDto } from './dtos/create-message.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  //todo Handle Auth and Guard
  @WebSocketServer()
  server: Server;
  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() newUserInfo: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.joinRoom(newUserInfo, client);
  }

  @SubscribeMessage('createMessage')
  create(
    @MessageBody() createMessage: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.create(createMessage, client);
  }

  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody('eventId', ParseUUIDPipe) eventId: string) {
    return this.messagesService.findAll(eventId);
  }

  @SubscribeMessage('typing')
  typing() {}
}
