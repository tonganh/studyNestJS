import {
  LoginCredentialDto,
  CreateUserReqDto,
} from './../auth/dto/auth-credentials.dto';

import { Repository, EntityRepository, MoreThanOrEqual } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { User } from './user.entity';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(createUserReqDto: CreateUserReqDto) {
    const userTest = this.create(createUserReqDto);
    return await this.save(userTest);
  }
  async validateUserPassword(
    loginCredentialDto: LoginCredentialDto,
  ): Promise<string> {
    const { username, password } = loginCredentialDto;
    const user = await this.findOne({ username });
    if (!user) {
      return null;
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      return user.username;
    } else {
      return null;
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
