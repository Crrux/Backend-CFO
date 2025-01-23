import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

const options: DataSourceOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'CrossFitObernai',
  entities: [],
};

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  ...options,
  synchronize: true,
};

export const connectionSource = new DataSource(options);
