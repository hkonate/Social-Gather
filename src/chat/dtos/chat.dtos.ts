export class GetMessagesResponseDto {
  id: string;
  conversation: string;
  eventId: string;
  authroId: {
    id: true;
    pseudo: string;
    phone: string;
  };
}
