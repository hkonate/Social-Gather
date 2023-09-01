import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pseudo?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;
}
