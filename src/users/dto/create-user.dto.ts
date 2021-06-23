import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
export class ApiCreateUsertResDto {
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
