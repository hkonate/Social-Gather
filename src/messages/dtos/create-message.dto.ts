import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
