import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserFactoryService } from './factory/index';
import { User, UserRepository, UserSchema } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller.js';
import { S3Service } from '@shared/index';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController, AdminController],
  providers: [UserService, UserFactoryService, UserRepository, S3Service],
  exports: [UserService, UserFactoryService, UserRepository, S3Service],
})
export class UserModule { }
