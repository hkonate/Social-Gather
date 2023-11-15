import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  picture: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  hobbies: string;
}

export class ProfileResponsesDTO {
  id: string;
  bio: string;
  picture: string;
  hobbies: string;
  user: {
    id: string;
    pseudo: string;
    phone: string;
    email: string;
  };
}
