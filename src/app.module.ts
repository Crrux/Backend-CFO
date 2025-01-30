import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './ormconfig';
import { ConfigModule } from '@nestjs/config';
import database from './environnement/database';
import mailer from './environnement/mailer';

@Module({
  imports: [
    ContactModule,
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, mailer],
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
