import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';
import { UserInterceptor } from './user/interceptors/user.interceptor';

@Module({
  imports: [UserModule, HomeModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor,
  }],
})
export class AppModule {}
