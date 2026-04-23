import { Company, CompanyRepository, CompanySchema, User, UserRepository, UserSchema } from '@models/index';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyFactoryService } from './factory/index.js';
import { S3Service } from '@shared/index';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, UserRepository, CompanyFactoryService, S3Service],
  exports: [CompanyService, CompanyRepository, UserRepository, CompanyFactoryService, S3Service],
})
export class CompanyModule { }
