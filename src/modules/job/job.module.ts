import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobFactoryService } from './factory/index.js';
import { CompanyModule } from '@modules/company/company.module';
import { JobRepository } from '@models/job/job.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from '@models/job/job.schema';
import { ApplicationRepository } from '@models/Application/application.repository';
import { Application, ApplicationSchema } from '@models/Application/application.schema';
import { S3Service } from '@shared/index';

@Module({
  imports: [
    CompanyModule,
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema },{ name: Application.name, schema: ApplicationSchema }])
  ],
  controllers: [JobController],
  providers: [JobService, JobFactoryService, JobRepository,ApplicationRepository,S3Service],
  exports: [JobService, JobFactoryService, JobRepository,ApplicationRepository,S3Service],
})
export class JobModule { }
