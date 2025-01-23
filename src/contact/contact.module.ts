import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from '../config/config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOSTNAME'),
          port: 465,
          secure: true,
          auth: {
            user: configService.get('MAILER_USERNAME'),
            pass: configService.get('MAILER_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Contact]),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
