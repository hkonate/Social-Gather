import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
  IsEmail,
  IsUUID,
  IsArray,
} from 'class-validator';

export class SignupDTO {
  @ApiProperty({ description: 'Firstname of the user', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ description: 'Pseudo of the user', example: 'johnDoe' })
  @IsString()
  @IsNotEmpty()
  pseudo: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '0612345678',
    required: false,
  })
  @IsOptional()
  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'phone must be a valid phone number',
  })
  phone?: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'Azerty1!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message: 'password must be a valid',
    },
  )
  password: string;
}

export class SignupResponseDto {
  @ApiProperty({
    description: 'ID of the user',
    example: '269141d9-0f3c-452b-a0b1-9fab89b68f57',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Firstname of the user', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ description: 'Pseudo of the user', example: 'johnDoe' })
  @IsString()
  @IsNotEmpty()
  pseudo: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'List of users JsonWebTokens',
    example: [
      'oiEhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieW9hbjkxIiwiaWQiOiJhNWQzY2ZjMi1lOTM5LTRhNjUtYTQxZS05Nzg1NTA4Y2ZlYjEiLCJpYXQiOjE3MDA1NTc4NzIsImV4cCI6MTcwNDE1Nzg3Mn0.nAO8uesvHBO2NoSE-kmqxRYkYO3c0oI6FvnYjWJSAD4',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieW9hbjkxIiwiaWQiOiJhNWQzY2ZjMi1lOTM5LTRhNjUtYTQxZS04Nzg1NTA4Y2ZlYjEiLCJpYXQiOjE3MDA1NTc4NzIsImV4cCI6MTcwNDE1Nzg3Mn0.nAO8uesvHBO2NoSE-kmqxRYkYO3c0oI6FvnYjWJSAD9',
    ],
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  authTokens: string[];
}

export class SigninDTO {
  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'Azerty1!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message: 'password must be a valid',
    },
  )
  password: string;
}

export class DeleteResponseDTO {
  @ApiProperty({
    description: 'ID of the user',
    example: '269141d9-0f3c-452b-a0b1-9fab89b68f57',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Firstname of the user', example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'Pseudo of the user', example: 'johnDoe' })
  @IsNotEmpty()
  @IsString()
  pseudo: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'List of users JsonWebTokens',
    example: [
      'oiEhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieW9hbjkxIiwiaWQiOiJhNWQzY2ZjMi1lOTM5LTRhNjUtYTQxZS05Nzg1NTA4Y2ZlYjEiLCJpYXQiOjE3MDA1NTc4NzIsImV4cCI6MTcwNDE1Nzg3Mn0.nAO8uesvHBO2NoSE-kmqxRYkYO3c0oI6FvnYjWJSAD4',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieW9hbjkxIiwiaWQiOiJhNWQzY2ZjMi1lOTM5LTRhNjUtYTQxZS04Nzg1NTA4Y2ZlYjEiLCJpYXQiOjE3MDA1NTc4NzIsImV4cCI6MTcwNDE1Nzg3Mn0.nAO8uesvHBO2NoSE-kmqxRYkYO3c0oI6FvnYjWJSAD9',
    ],
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  authTokens: string[];
}
export class SigninResponseDTO extends DeleteResponseDTO {
  profile: {
    bio: string;
    picture: string;
  };
}
