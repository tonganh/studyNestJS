import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import moment = require('moment');

@Entity({
  name: 'users',
})
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Expose()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  email: string;

  @Column()
  @ApiProperty()
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

  async generateResetToken() {
    const token = `${Math.floor(1000 + Math.random() * 9000)}`;
    this.resetPasswordToken = token;

    this.resetTokenExpire = moment().add(15, 'minutes').toDate();

    return this.save();
  }
}
