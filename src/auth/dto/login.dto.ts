import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginResDto {
  @IsString()
  @Expose()
  @ApiProperty()
  readonly accessToken: string;
  //   @IsString()
  //   @Expose()
  //   @ApiProperty()
  //   readonly role: string;
}

export class ApiLoginResDto {
  @ApiProperty({
    type: LoginResDto,
  })
  readonly data: LoginResDto;
}
