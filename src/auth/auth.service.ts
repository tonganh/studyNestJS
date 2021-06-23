import { ForgotReqDto } from './dto/forgot.dto';
import {
  AuthCredentialsDto,
  LoginCredentialDto,
} from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { MailerService } from 'src/services/mailers.service';
import { ResetReqDto } from './dto/reset.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}
  async signUp(authCredentialsDto: AuthCredentialsDto) {
    return await this.userRepository.signUp(authCredentialsDto);
  }
  async signIn(
    loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      loginCredentialDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid credential');
    }
    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async forgotUser(forgotForm: ForgotReqDto) {
    const user = await this.userRepository.findOne({ email: forgotForm.email });
    if (!user) {
      throw new NotFoundException('Tài khoản chưa tồn tại');
    }

    await user.generateResetToken();

    console.log('user', user);

    try {
      await this.mailService.sendMailResetPassword(user);
    } catch (error) {
      console.error(error);
    }

    return user;
  }

  async renewPassword(resetForm: ResetReqDto) {
    const { email, password, token } = resetForm;

    const user = await this.userRepository.findByResetToken(email, token);

    if (!user) {
      throw new NotFoundException(
        'Tài khoản chưa tồn tại hoặc token đã hết hạn',
      );
    }
    user.password = password;
    user.hashPassword();

    user.save();

    return null;
  }
}
