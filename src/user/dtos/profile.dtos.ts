import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  @IsNotEmpty()
  bio: string;
  @IsString()
  @IsNotEmpty()
  picture: string;
}

export class ProfileResponsesDTO {
  id: string;
  bio: string;
  picture: string;
  userId: string;
}
