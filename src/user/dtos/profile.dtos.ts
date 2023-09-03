import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfileDTO {
  @IsString()
  @IsNotEmpty()
  bio: string;
  @IsString()
  @IsNotEmpty()
  picture: string;
}

export class UpdateProfileDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  picture: string;
}

export class ProfileResponsesDTO {
  id: string;
  bio: string;
  picture: string;
  user: {
    id: string;
    pseudo: string;
    phone: string;
    email: string;
  };
}
