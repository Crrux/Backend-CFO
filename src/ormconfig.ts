import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Contact } from './contact/entities/contact.entity';
import { ConfigService } from './config/config.service';

const configService = new ConfigService({
  folder: './config',
});

const options: DataSourceOptions = {
  type: 'mariadb',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get('DB_PORT'), 10),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [Contact],
};

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  ...options,
  synchronize: true,
};

export const connectionSource = new DataSource(options);
