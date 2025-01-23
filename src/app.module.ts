import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ContactModule,
    ConfigModule.forRoot({
      folder: './config',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
