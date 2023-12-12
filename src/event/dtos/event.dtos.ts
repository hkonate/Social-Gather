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
  @ApiProperty({ description: 'The title of the event', example: 'Quick' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'A short description of the event by the creator of the event',
    example:
      'I invite you to join me eat after school at Quick, which is a delicious fast food.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Appointment time', example: '2024-10-26T12:00' })
  @IsString()
  @IsNotEmpty()
  schedule: string;

  @ApiProperty({
    description: 'The location where the event will take place',
    example: '25 Bd de Sébastopol, 75001 Paris',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Number of attendees',
    example: 12,
    default: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  limit?: string;

  @ApiProperty({
    description: "Imageses url of event's location or menu host by cloudinary",
    example: [
      'https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517112/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/ceabynqkowpq6ntjwfkn.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517113/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/kjiqafhbyxghnunu4ame.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517114/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/rlwhzmowr7zigdebt0ud.jpg',
      'https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517112/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/ceabynqkowpq6ntjwfkn.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517113/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/kjiqafhbyxghnunu4ame.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517114/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/rlwhzmowr7zigdebt0ud.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => File)
  images: Array<Express.Multer.File>;

  @ApiProperty({
    description:
      'This describes the specific dietary preference(s) of the event',
    example: ['HALAL', 'VEGAN', 'VEGE', 'CASHER', 'STANDARD'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(InclusionType, { each: true })
  @Validate(IsNotDuplicate)
  inclusive: InclusionType[];
}

export class UpdateEventDTO {
  @ApiProperty({
    description: 'The title of the event',
    example: 'Quick',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    description: 'A short description of the event by the creator of the event',
    example:
      'I invite you to join me eat after school at Quick, which is a delicious fast food.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    description: "Imageses url of event's location or menu host by cloudinary",
    example: [
      'https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517112/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/ceabynqkowpq6ntjwfkn.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517113/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/kjiqafhbyxghnunu4ame.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517114/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/rlwhzmowr7zigdebt0ud.jpg',
      'https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517112/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/ceabynqkowpq6ntjwfkn.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517113/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/kjiqafhbyxghnunu4ame.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517114/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/rlwhzmowr7zigdebt0ud.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => File)
  images: Array<Express.Multer.File>;

  @ApiProperty({
    description: 'The location where the event will take place',
    example: '25 Bd de Sébastopol, 75001 Paris',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiProperty({
    description: 'Number of attendees',
    example: 12,
    default: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  limit?: string;

  @ApiProperty({
    description:
      'This describes the specific dietary preference(s) of the event',
    example: ['HALAL', 'VEGAN', 'VEGE', 'CASHER', 'STANDARD'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(InclusionType, { each: true })
  @Validate(IsNotDuplicate)
  inclusive?: InclusionType[];
}

export class EventResponsesDTO {
  @ApiProperty({ description: 'The title of the event', example: 'Quick' })
  title: string;

  @ApiProperty({
    description: 'A short description of the event by the creator of the event',
    example:
      'I invite you to join me eat after school at Quick, which is a delicious fast food.',
  })
  description: string;

  @ApiProperty({
    description: 'Appointment time',
    example: '2024-10-26T12:00',
  })
  schedule: string;

  @ApiProperty({
    description: 'The location where the event will take place',
    example: '25 Bd de Sébastopol, 75001 Paris',
  })
  address: string;

  @ApiProperty({
    description: "Imageses url of event's location or menu host by cloudinary",
    example: [
      'https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517112/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/ceabynqkowpq6ntjwfkn.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517113/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/kjiqafhbyxghnunu4ame.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517114/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/rlwhzmowr7zigdebt0ud.jpg',
      'https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517112/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/ceabynqkowpq6ntjwfkn.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517113/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/kjiqafhbyxghnunu4ame.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517114/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/rlwhzmowr7zigdebt0ud.jpg',
    ],
  })
  images: string[];

  @ApiProperty({ description: 'Number of attendees', example: 12, default: 20 })
  limit: string;

  @ApiProperty({
    description:
      'This describes the specific dietary preference(s) of the event',
    example: ['HALAL', 'VEGAN', 'VEGE', 'CASHER', 'STANDARD'],
  })
  inclusive: $Enums.InclusionType[];

  @ApiProperty({
    description: "Informations of event's creator",
    example: {
      id: '7a9a72da-7e90-4fdf-9b1c-a7ea25af34d7',
      pseudo: 'JohnDoe',
      phone: '0612234556',
      email: 'johndoe@gmail.com',
    },
  })
  creator: {
    id: string;
    pseudo: string;
    phone: string;
    email: string;
  };

  @ApiProperty({
    description: 'The id of all attendees',
    example: [
      '7a9a72da-7e90-4fdf-9b1c-a7ea25af34d7',
      '7a9a72da-7e90-4fdf-9b1c-a7ea25af34d4',
    ],
  })
  listOfAttendees: {
    id: string;
  }[];
}
