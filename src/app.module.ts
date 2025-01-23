import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './ormconfig';

@Module({
  imports: [
    ContactModule,
    ConfigModule.forRoot({
      folder: './config',
    }),
    // TypeOrmModule.forRoot(typeOrmModuleOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
