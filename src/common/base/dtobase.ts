import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DTOBase {
  @ApiProperty()
  @IsNumber()
  @Expose()
  status: number;

  @ApiProperty()
  @IsString()
  @Expose()
  @IsOptional()
  message?: string;
}
