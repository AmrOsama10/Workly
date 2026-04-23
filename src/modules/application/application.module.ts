import { CompanyService } from "@modules/company/company.service";
import { ApplicationController } from "./application.controller";
import { ApplicationService } from "./application.service";
import { Module } from "@nestjs/common";
import { JobService } from "@modules/job/job.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Application, ApplicationRepository } from "@models/index";
import { ApplicationSchema } from "@models/Application/application.schema";
import { JobModule } from "@modules/job/job.module";
import { CompanyModule } from "@modules/company/company.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name:Application.name, schema:ApplicationSchema}]),
        CompanyModule,
        JobModule
    ],
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository, CompanyService, JobService],
  exports: [ApplicationService],
})
export class ApplicationModule {}