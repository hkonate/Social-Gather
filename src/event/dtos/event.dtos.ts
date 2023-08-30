import { $Enums, InclusionType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
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

  @IsArray()
  @IsEnum(InclusionType, { each: true })
  @Validate(IsNotDuplicate)
  inclusive: InclusionType[];
}
