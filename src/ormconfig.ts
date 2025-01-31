import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Contact } from './contact/entities/contact.entity';
import { ConfigService } from '@nestjs/config';

export const typeOrmModuleOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mariadb',
  host: configService.get('database.HOST'),
  port: configService.get('database.PORT'),
  username: configService.get('database.USERNAME'),
  password: configService.get('database.PASSWORD'),
  database: configService.get('database.DATABASE'),
  entities: [Contact],
  synchronize: true,
});

export const connectionSource = (configService: ConfigService): DataSource =>
  new DataSource(typeOrmModuleOptions(configService) as DataSourceOptions);
