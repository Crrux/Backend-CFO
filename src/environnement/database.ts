import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  HOST: process.env.DB_HOST,
  PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DATABASE: process.env.DB_DATABASE,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
}));
