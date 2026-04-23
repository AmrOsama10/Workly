import { Auth, Public, User } from '@common/decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFactoryService } from './factory/index.js';
import { JobService } from './job.service';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudMulter, CloudStorage } from '@common/multer/cloud.multer';
import type { ImulterFile } from '@common/interfaces/multer-options-interface';

@Controller('job')
@Auth(['user', 'admin'])
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly jobFactoryService: JobFactoryService
  ) { }

  @Post('company/:companyId/create')
  async create(@Body() createJobDto: CreateJobDto, @Param('companyId') companyId: string, @User() user: any) {
    const job = this.jobFactoryService.createJob(createJobDto, user, companyId);
    const jobCreated = await this.jobService.create(job, companyId, user);
    return {
      message: 'Job created successfully',
      success: true,
      job: jobCreated
    };
  }

  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    const job = await this.jobService.findOne(id);
    return {
      message: 'Job found successfully',
      success: true,
      job
    };
  }

  @Patch(':id/company/:companyId/update')
  async update(@Param('id') id: Types.ObjectId, @Param('companyId') companyId: string, @Body() updateJobDto: UpdateJobDto , @User() user: any) {
    const job = await this.jobService.update(id,companyId, updateJobDto,user);
    return {
      message: 'Job updated successfully',
      success: true,
      job
    };
  }

  @Delete(':id/company/:companyId/remove')
  async remove(@Param('id') id: Types.ObjectId , @Param('companyId') companyId: string, @User() user: any) {
    await this.jobService.remove(id, companyId, user);
    return {
      message: 'Job removed successfully',
      success: true
    };
  }

  @UseInterceptors(FileInterceptor('resume', cloudMulter({ options: { allowedMimeTypes: ['application/pdf'] } })))
  @Post(':id/apply')
  async apply(@Param('id') id: Types.ObjectId,@UploadedFile() file: ImulterFile, @User() user: any) {
    const application = await this.jobService.apply(id, file, user);
    return {
      message: 'Job applied successfully',
      success: true,
      application
    };
  }
}
