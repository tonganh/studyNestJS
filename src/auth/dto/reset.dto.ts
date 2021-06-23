import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class ResetReqDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly token: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
