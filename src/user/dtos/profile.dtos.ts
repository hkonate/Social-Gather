import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bio: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  picture: string;

  @ApiProperty({ required: false })
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
