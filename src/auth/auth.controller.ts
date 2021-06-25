import { LoginResDto } from './dto/login.dto';
import { TransformInterceptor } from './../common/interceptor/transform.interceptor';
import { DTOBase } from './../common/base/dtobase';
import { ApiCreateUsertResDto } from './../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import {
  LoginCredentialDto,
  CreateUserReqDto,
} from './dto/auth-credentials.dto';
import { ForgotReqDto, ForgotResDto } from './dto/forgot.dto';
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
  signUp(@Body(ValidationPipe) createUserReqDto: CreateUserReqDto) {
    return this.authService.signUp(createUserReqDto);
  }

  @Post('/signIn')
  @ApiCreatedResponse({
    description: 'Login successfull',
    type: CreateUserReqDto,
  })
  @UseInterceptors(new TransformInterceptor(LoginResDto))
  async signIn(@Body(ValidationPipe) loginCredentialDto: LoginCredentialDto) {
    const res = await this.authService.signIn(loginCredentialDto);
    return res;
  }

  @Post('/auth/forgotpassword')
  @ApiCreatedResponse({
    description: 'Send token to email, do next step to reset password',
    type: DTOBase,
  })
  @UseInterceptors(new TransformInterceptor(ForgotResDto))
  async forgot(@Body() forgotForm: ForgotReqDto) {
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
}
