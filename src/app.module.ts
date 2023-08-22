import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { AuthGuard } from './user/auth/guards/auth.guard';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UserModule, HomeModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor,
  },{
    provide: APP_GUARD,
    useClass: AuthGuard,
  }],
})
export class AppModule {}
