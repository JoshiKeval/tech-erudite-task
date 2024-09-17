import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsLowercase, IsString } from 'class-validator';

export class LoginReqDto {
  @ApiProperty({
    required: true,
    example: 'john@mail.com',
  })
  @Transform(({ value }: TransformFnParams) => value?.toLowerCase())
  @IsEmail()
  @IsLowercase()
  readonly email: string;

  @ApiProperty({
    example: 'password',
    required: true,
  })
  @IsString()
  readonly password: string;

  @ApiProperty({
    example: 'role',
    required: true,
  })
  @IsString()
  readonly role: string;
}
