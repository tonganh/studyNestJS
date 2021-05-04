import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  singUp(
    @Body(ValidationPipe) authCredentialDTO: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialDTO);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialDTO: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialDTO);
  }
}
