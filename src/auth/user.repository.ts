import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = AuthCredentialsDto;
    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password, user.salt);
    console.log(user.password);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        //duplicate username
        throw new ConflictException('Username already existed.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async validateUserPassword(
    AuthCredentialsDtoTest: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = AuthCredentialsDtoTest;
    const user = await this.findOne({ username });
    if (user && user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
