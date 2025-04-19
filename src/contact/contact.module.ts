import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Read password from Docker secrets if available
        let password = configService.get('mailer.PASSWORD');
        try {
          if (fs.existsSync('/run/secrets/mailer_password')) {
            password = fs
              .readFileSync('/run/secrets/mailer_password', 'utf8')
              .trim();
          }
        } catch (error) {
          console.log(
            'No Docker secret found for mailer password, using environment variable',
          );
        }

        // Read username from Docker secrets if available
        let username = configService.get('mailer.USERNAME');
        try {
          if (fs.existsSync('/run/secrets/mailer_username')) {
            username = fs
              .readFileSync('/run/secrets/mailer_username', 'utf8')
              .trim();
          }
        } catch (error) {
          console.log(
            'No Docker secret found for mailer username, using environment variable',
          );
        }

        return {
          transport: {
            host: configService.get('mailer.HOSTNAME'),
            port: 465,
            secure: true,
            auth: {
              user: username,
              pass: password,
            },
            defaults: {
              from: `${configService.get('mailer.USERNAME_NAME')} <${username}>`,
            },
          },
        };
      },
    }),
    TypeOrmModule.forFeature([Contact]),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
