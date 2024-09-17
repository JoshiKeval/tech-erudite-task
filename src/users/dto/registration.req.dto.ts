import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsLowercase,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Roles } from 'src/core';

export class RegistrationReqDto {
  @ApiProperty({
    example: 'keval',
    required: true,
  })
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    example: 'joshi',
    required: true,
  })
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    example: 'password',
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  readonly password: string;

  @ApiProperty({
    required: true,
    example: 'john@mail.com',
  })
  @Transform(({ value }: TransformFnParams) => value?.toLowerCase())
  @IsEmail()
  @IsLowercase()
  readonly email: string;

  @ApiProperty({
    description: 'provider',
    example: Roles.ADMIN,
    enum: [Roles.ADMIN, Roles.CUSTOMER],
    required: true,
  })
  @IsEnum([Roles.ADMIN, Roles.CUSTOMER])
  @IsString()
  readonly role: Roles;
}
