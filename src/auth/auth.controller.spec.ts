import { DTOBase } from './../common/base/dtobase';
import { mockedUser } from '../users/user.mock';
import { User } from './../users/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtModule } from '@nestjs/jwt';
import { ServiceModule } from './../services/services.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './../users/user.repository';
import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { typeOrmConfig } from '../config/typeorm.config';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('AuthController test', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userData;
  let app: INestApplication;

  beforeEach(async () => {
    userData = {
      ...mockedUser,
    };
    const userRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'tetnamnaychualamratien',
          signOptions: {
            expiresIn: '1d',
          },
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([UserRepository]),
        ServiceModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('When registering', () => {
    describe('And using valid data', () => {
      it('Should return status 200 and message: The record has been successfully created. ', () => {
        const result: DTOBase = {
          message: 'The record has been successfully created.',
          status: 200,
        };

        return request(app.getHttpServer())
          .post('/api/signUp')
          .send({
            ...mockedUser,
          })
          .expect(result);
      });
    });

    describe('And when using invalid data', () => {
      describe('Using and email and username existed in DB', () => {
        it('Should return status 409 and message: Usename or email existed. ', () => {
          const resultConflict = {
            statusCode: 409,
            message: 'Usename or email existed',
            error: 'Conflict',
          };

          return request(app.getHttpServer())
            .post('/api/signUp')
            .send({
              ...mockedUser,
            })
            .expect(resultConflict);
        });
      });

      describe('Using an email existed in DB', () => {
        it('Should return status 409 and message: Usename or email existed. ', () => {
          const resultConflict = {
            statusCode: 409,
            message: 'Usename or email existed',
            error: 'Conflict',
          };

          return request(app.getHttpServer())
            .post('/api/signUp')
            .send({
              ...mockedUser,
              username: 'tongnocanh11223344',
            })
            .expect(resultConflict);
        });
      });

      describe('Using  username existed in DB', () => {
        it('Should return status 409 and message: Usename or email existed. ', () => {
          const resultConflict = {
            statusCode: 409,
            message: 'Usename or email existed',
            error: 'Conflict',
          };

          return request(app.getHttpServer())
            .post('/api/signUp')
            .send({
              ...mockedUser,
              email: 'anhtn.dev40@gmail.com',
            })
            .expect(resultConflict);
        });
      });
    });
  });

  describe('When login', () => {
    describe('Using valid account', () => {
      it('Shoud return status 201 and accesstoken ', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/signIn')
          .send({
            username: mockedUser.username,
            password: mockedUser.password,
          });
        expect(response.status).toBe(201);
      });
    });

    describe('Using invalid account', () => {
      const responseInvalid = {
        status: 401,
        message: 'Wrong username or password',
      };
      describe('Wrong username', () => {
        it('Should response status 401 and message: wrong username or password', async () => {
          return request(app.getHttpServer())
            .post('/api/signIn')
            .send({
              username: '123123',
              password: mockedUser.password,
            })
            .expect(responseInvalid);
        });
      });

      describe('Wrong password', () => {
        it('Should response status 401 and message: wrong username or password', () => {
          return request(app.getHttpServer())
            .post('/api/signIn')
            .send({
              username: mockedUser.username,
              password: 'lalalalala',
            })
            .expect(responseInvalid);
        });
      });
    });
  });

  describe('Using  API forgot password', () => {
    describe('Using right email, and registed in DB', () => {
      it('Should  have status 201', async () => {
        const data = await request(app.getHttpServer())
          .post('/api/auth/forgotpassword')
          .send({
            email: mockedUser.email,
          });

        expect(data.status).toBe(201);
      });
    });

    describe('Using Wrong email, and registed in DB', () => {
      it('Should  have status 401', async () => {
        const data = await request(app.getHttpServer())
          .post('/api/auth/forgotpassword')
          .send({
            email: 'tongngocanhcampha123@gmail.com',
          });

        expect(data.body.status).toBe(401);
      });
    });
  });
});
