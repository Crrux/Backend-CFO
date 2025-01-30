import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import mailer from '../environnement/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [mailer.KEY],
      useFactory: (mailerConfig: ConfigType<typeof mailer>) => ({
        transport: {
          host: mailerConfig.HOSTNAME,
          port: 465,
          secure: true,
          auth: {
            user: mailerConfig.USERNAME,
            pass: mailerConfig.PASSWORD,
          },
        },
      }),
    }),
    TypeOrmModule.forFeature([Contact]),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
