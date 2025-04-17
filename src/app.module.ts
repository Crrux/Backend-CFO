import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import database from './environnement/database';
import mailer from './environnement/mailer';
import { Contact } from './contact/entities/contact.entity';

@Module({
  imports: [
    ContactModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, mailer],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const synchronize = configService.get('database.SYNCHRONIZE');
        return {
          type: configService.get('database.TYPE') as any,
          database: configService.get('database.DATABASE') as string,
          entities: [Contact],
          synchronize: synchronize === undefined ? true : synchronize,
          host: configService.get('database.HOST'),
          port: configService.get('database.PORT'),
          username: configService.get('database.USERNAME'),
          password: configService.get('database.PASSWORD') as string,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
