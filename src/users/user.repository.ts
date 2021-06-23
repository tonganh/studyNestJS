import {
  AuthCredentialsDto,
  LoginCredentialDto,
} from './../auth/dto/auth-credentials.dto';

import { Repository, EntityRepository, MoreThanOrEqual } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { User } from './user.entity';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto) {
    try {
      const userTest = this.create(authCredentialsDto);

      return await this.save(userTest);

      // console.log('12312');

      // return '12312';
    } catch (error) {
      console.log(
        '🚀 ~ file: user.repository.ts ~ line 22 ~ UserRepository ~ signUp ~ error',
        error,
      );
      if (error.err_no == 1062) {
        throw new ConflictException('Usename or email existed');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async validateUserPassword(
    loginCredentialDto: LoginCredentialDto,
  ): Promise<string> {
    const { username, password } = loginCredentialDto;
    const user = await this.findOne({ username });
    if (!user) {
      throw new ConflictException('Username not existed');
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      return user.username;
    } else {
      throw new ConflictException('Wrong password');
    }
  }

  findByResetToken(email: string, token: string) {
    return this.findOne({
      where: {
        email,
        resetPasswordToken: token,
        resetTokenExpire: MoreThanOrEqual(moment().toDate()),
      },
    });
  }
}
