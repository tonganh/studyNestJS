import { Role } from './../common/type';
import { ChildEntity } from 'typeorm';
import { User } from './../users/user.entity';
@ChildEntity(Role.Student)
export class Student extends User {}
