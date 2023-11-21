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
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  schedule: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  limit?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => File)
  images: Array<Express.Multer.File>;

  @IsOptional()
  @IsArray()
  @IsEnum(InclusionType, { each: true })
  @Validate(IsNotDuplicate)
  inclusive: InclusionType[];
}

export class UpdateEventDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  schedule?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => File)
  images: Array<Express.Multer.File>;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  limit?: string;

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
