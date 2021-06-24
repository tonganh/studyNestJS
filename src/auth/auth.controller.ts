import { DTOBase } from './../common/base/dtobase';
import { ApiSignInResDto } from './../users/dto/signin-user.dto';
import { ApiCreateUsertResDto } from './../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
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
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ApiCreateUsertResDto,
  })
  signUp(@Body(ValidationPipe) AuthCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(AuthCredentialsDto);
  }

  @Post('/signIn')
  @ApiCreatedResponse({
    description: 'Login successfull',
    type: ApiSignInResDto,
  })
  signIn(@Body(ValidationPipe) loginCredentialDto: LoginCredentialDto) {
    return this.authService.signIn(loginCredentialDto);
  }

  @Post('/auth/forgotpassword')
  @ApiCreatedResponse({
    description: 'Send token to email, do next step to reset password',
    type: DTOBase,
  })
  async forgot(@Body() forgotForm: ForgotReqDto): Promise<DTOBase> {
    return this.authService.forgotUser(forgotForm);
  }

  @Post('/auth/renewpassword')
  @ApiCreatedResponse({
    description: 'Reset password successfull5',
    type: DTOBase,
  })
  async renewPassword(@Body() resetForm: ResetReqDto): Promise<DTOBase> {
    return this.authService.renewPassword(resetForm);
  }

  @Post('/findall')
  async findAll() {
    return this.authService.findAll();
  }
}
