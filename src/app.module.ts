import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import devConfig from './config/env/dev.config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { JobModule } from './modules/job/job.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@shared/index';
import { CompanyModule } from './modules/company/company.module';
import { CleanupService } from '@common/index';
import { ApplicationModule } from '@modules/application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [devConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("db").url
      })
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    JobModule,
    UserModule,
    JwtModule,
    CompanyModule,
    ApplicationModule

  ],
  controllers: [AppController],
  providers: [AppService, CleanupService],
})
export class AppModule { }
