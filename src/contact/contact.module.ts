import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('mailer.HOSTNAME'),
          port: 465,
          secure: true,
          auth: {
            user: configService.get('mailer.USERNAME'),
            pass: configService.get('mailer.PASSWORD'),
          },
          defaults: {
            from: `${configService.get('mailer.USERNAME_NAME')} <${configService.get('mailer.USERNAME')}>`,
          },
        },
      }),
    }),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
