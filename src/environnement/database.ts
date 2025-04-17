import { registerAs } from '@nestjs/config';
import * as path from 'path';

export default registerAs('database', () => ({
  TYPE: process.env.DB_TYPE || 'sqlite',
  DATABASE:
    process.env.DB_DATABASE || path.resolve(__dirname, '../../database.sqlite'),
  SYNCHRONIZE: process.env.DB_SYNCHRONIZE === 'true',
  HOST: process.env.DB_HOST,
  PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
}));
