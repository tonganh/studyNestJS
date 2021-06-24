import { ApiSignInResDto } from './../users/dto/signin-user.dto';
import { MailerService } from './../services/mailers.service';
import { DTOBase } from './../common/base/dtobase';
import {
  TYPEORM_ERROR_DUPLICATE_CODE_TELEPHONE,
  TYPEORM_ERROR_DUPLICATE_CODE_EMAIL,
} from './../common/constant/index';
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
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { ResetReqDto } from './dto/reset.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  private authError(error: any, dto: any) {
    switch (error.errno) {
      case TYPEORM_ERROR_DUPLICATE_CODE_EMAIL:
        throw new ConflictException([
          {
            property: 'email',
            constraints: { isDuplicate: 'Duplicate email' },
            target: dto,
            value: dto.email,
          },
        ]);
      default:
        throw new BadRequestException(error.message);
    }
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<DTOBase> {
    try {
      await this.userRepository.signUp(authCredentialsDto);
      return {
        status: 200,
        message: 'The record has been successfully created.',
      };
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('Usename or email existed');
      }
      throw new InternalServerErrorException();
    }
  }

  async signIn(loginCredentialDto: LoginCredentialDto) {
    try {
      const username = await this.userRepository.validateUserPassword(
        loginCredentialDto,
      );

      if (!username) {
        throw new UnauthorizedException('Invalid credential');
      }

      const payload: JwtPayload = { username };
      const accessToken = this.jwtService.sign(payload);
      return {
        status: 201,
        accessToken,
      };
    } catch (error) {
      return {
        status: 401,
        message: 'Wrong username or password',
      };
    }
  }

  async forgotUser(forgotForm: ForgotReqDto): Promise<DTOBase> {
    try {
      const user = await this.userRepository.findOne({
        email: forgotForm.email,
      });
      if (!user) {
        throw { message: 'Email not exist' };
      }
      await user.generateResetToken();
      await this.mailService.sendMailResetPassword(user);
      return {
        status: 201,
        message: 'Check your email and do next step',
      };
    } catch (error) {
      return {
        status: 401,
        message: error.message,
      };
    }
  }

  async renewPassword(resetForm: ResetReqDto): Promise<DTOBase> {
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

    return {
      status: 201,
      message: 'Renew password successfull',
    };
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
