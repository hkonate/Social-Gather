import { ApiProperty } from '@nestjs/swagger';
import { $Enums, InclusionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMinSize,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidateNested,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotDuplicate', async: false })
class IsNotDuplicate implements ValidatorConstraintInterface {
  validate(
    value: InclusionType[],
    validationArguments?: ValidationArguments,
  ): boolean {
    const uniqueVal: Set<$Enums.InclusionType> = new Set(value);
    return uniqueVal.size === value.length;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'The inclusive array can not contains duplicate values.';
  }
}
class File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
export class CreateEventDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  schedule: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  limit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => File)
  images: Array<Express.Multer.File>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(InclusionType, { each: true })
  @Validate(IsNotDuplicate)
  inclusive: InclusionType[];
}

export class UpdateEventDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  schedule?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => File)
  images: Array<Express.Multer.File>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  limit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(InclusionType, { each: true })
  @Validate(IsNotDuplicate)
  inclusive?: InclusionType[];
}

export class EventResponsesDTO {
  title: string;
  description: string;
  schedule: string;
  address: string;
  images: string[];
  limit: string;
  inclusive: $Enums.InclusionType[];
  creator: {
    id: string;
    pseudo: string;
    phone: string;
    email: string;
  };
  listOfAttendees: {
    id: string;
  }[];
}
