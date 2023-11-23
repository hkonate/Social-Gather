import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pseudo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;
}

export class UserResponsesDTO {
  @ApiProperty({
    description: 'ID of the user',
    example: '269141d9-0f3c-452b-a0b1-9fab89b68f57',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Pseudo of the user', example: 'johnDoe' })
  @IsString()
  @IsNotEmpty()
  pseudo: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '0612345678',
  })
  phone: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's profile",
    example: {
      bio: 'Hi I am John Doe and I love sports',
      picture:
        'https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517112/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/ceabynqkowpq6ntjwfkn.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517113/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/kjiqafhbyxghnunu4ame.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517114/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/rlwhzmowr7zigdebt0ud.jpg',
    },
  })
  profile: {
    bio: string;
    picture: string;
  };
}
