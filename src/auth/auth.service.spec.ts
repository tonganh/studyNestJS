// import { Repository } from 'typeorm';
// import { UsersModule } from './../users/users.module';
// import { Test } from '@nestjs/testing';
// import { UserRepository } from './../users/user.repository';
// import { MailerService } from './../services/mailers.service';
// import { AuthService } from './auth.service';
// import { JwtService } from '@nestjs/jwt';
// import { MailService } from '@sendgrid/mail';
// import { INestApplication } from '@nestjs/common';
// import { User } from './../users/user.entity';

// const mockTasksRepository = () => ({
//   getTasks: jest.fn(),
//   findOne: jest.fn(),
// });

// let repository: Repository<User>;
// let app: INestApplication;
// describe('AuthService', () => {
//   let authService: AuthService;
//   let mailService: MailerService;
//   let userRepository: UserRepository;
//   let jwtService: JwtService;
//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       imports: [UsersModule],
//     }).compile();
//     app = module.createNestApplication();
//     await app.init();

//     repository = module.get('UserRepository');
//   });

//   afterEach(async () => {
//     // const data = await repository.find({});
//     console.log(
//       '🚀 ~ file: auth.service.spec.ts ~ line 36 ~ afterEach ~ data',
//       repository,
//     );
//   });
//   test('123', () => {
//     expect(1 + 2).toBe(3);
//   });
// });
