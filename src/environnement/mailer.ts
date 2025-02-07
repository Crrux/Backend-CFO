import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  HOSTNAME: process.env.MAILER_HOSTNAME,
  USERNAME: process.env.MAILER_USERNAME,
  USERNAME_NAME: process.env.MAILER_USERNAME_NAME,
  PASSWORD: process.env.MAILER_PASSWORD,
  SUBJECT: process.env.MAILER_SUBJECT,
}));
