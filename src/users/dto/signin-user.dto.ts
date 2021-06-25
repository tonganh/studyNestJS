import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class ApiSignInResDto {
  @ApiProperty()
  @IsNumber()
  @Expose()
  status: number;

  @ApiProperty()
  @IsString()
  @Expose()
  accessToken: string;
}
