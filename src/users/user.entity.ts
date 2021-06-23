import { TYPEORM_ERROR_DUPLICATE_CODE } from '../common/constant';
import { AuthCredentialsDto } from './../auth/dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  getConnectionManager,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import moment = require('moment');

@Entity({
  name: 'users',
})
// @Unique('usernameAndEmail', ['username, email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Expose()
  @Column({
    type: 'varchar',
    length: 100,
  })
  email: string;

  @ApiProperty()
  @Expose()
  @Column({
    type: 'varchar',
    length: 100,
  })
  username: string;

  @Column()
  @ApiProperty()
  password: string;

  @ApiProperty({
    type: 'string',
  })
  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  resetPasswordToken: string;

  @ApiProperty({
    type: 'string',
  })
  @Column({
    type: 'date',
    nullable: true,
  })
  resetTokenExpire: Date;

  @BeforeInsert()
  hashPassword() {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  @BeforeInsert()
  async checkEmailAndUserName() {
    const userRepo = getConnectionManager().get().getRepository('users');

    const user = await userRepo.find({
      where: [
        {
          email: this.email,
        },
        {
          username: this.username,
        },
      ],
    });

    console.log(
      '🚀 ~ file: user.entity.ts ~ line 75 ~ User ~ checkEmailAndUserName ~ user',
      user,
    );

    if (user.length !== 0) {
      throw {
        err_no: TYPEORM_ERROR_DUPLICATE_CODE,
      };
    }
  }

  async generateResetToken() {
    const token = `${Math.floor(1000 + Math.random() * 9000)}`;
    this.resetPasswordToken = token;

    this.resetTokenExpire = moment().add(15, 'minutes').toDate();

    return this.save();
  }
}
