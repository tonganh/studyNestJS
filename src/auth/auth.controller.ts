import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}
  @Post('/signUp')
  signUp(
    @Body(ValidationPipe) AuthCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.AuthService.signUp(AuthCredentialsDto);
  }
  @Post('/signIn')
  signIn(
    @Body(ValidationPipe) AuthCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.AuthService.signIn(AuthCredentialsDto);
  }
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log('req', req);
  }
}
