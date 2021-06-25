import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginCredentialDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
export class CreateUserReqDto extends LoginCredentialDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly fullname?: string;
}
