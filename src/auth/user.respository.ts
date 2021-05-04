import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredential: AuthCredentialsDto): Promise<void> {
    try {
      const { username, password } = authCredential;
      const user = new User();
      user.username = username;
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, user.salt);
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User already existed.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredential: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredential;
    const user = this.findOne({ username });
    if (user && (await (await user).validatePassword(password))) {
      return (await user).username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
