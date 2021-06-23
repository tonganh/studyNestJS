import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import {
  LoginCredentialDto,
  AuthCredentialsDto,
} from './dto/auth-credentials.dto';
import { ForgotReqDto } from './dto/forgot.dto';
import { ResetReqDto } from './dto/reset.dto';
@ApiTags('Auth')
@Controller('/api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  signUp(@Body(ValidationPipe) AuthCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(AuthCredentialsDto);
  }

  @Post('/signIn')
  signIn(
    @Body(ValidationPipe) loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(loginCredentialDto);
  }

  @Post('/auth/forgotpassword')
  async forgot(@Body() forgotForm: ForgotReqDto) {
    return this.authService.forgotUser(forgotForm);
  }

  @Post('/aut/renewpassword')
  async renewPassword(@Body() resetForm: ResetReqDto) {
    return this.authService.renewPassword(resetForm);
  }
}
