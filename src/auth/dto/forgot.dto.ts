import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class ForgotReqDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  readonly email: string;
}

export class ForgotResDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly message: string;
}
