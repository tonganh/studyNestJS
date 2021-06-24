import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'lovehangga',
  database: 'test',
  entities: [__dirname + '/../**/*.entity{.js, .ts}'],
  synchronize: true,
  autoLoadEntities: true,
  keepConnectionAlive: true,
};
