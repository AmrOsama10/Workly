import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { CompanyService } from '@modules/company/company.service';
import { JobRepository } from '@models/job/job.repository';
import { Types } from 'mongoose';
import { ApplicationRepository } from '@models/Application/application.repository';
import type { ImulterFile } from '@common/interfaces/multer-options-interface';
import { S3Service } from '@shared/index';
import { sendEmail } from '@common/index';


@Injectable()
export class JobService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly jobRepository: JobRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly s3Service: S3Service,
  ) { }
  async create(job: Job, companyId: string, user: any) {
    const company = await this.companyService.findOne(companyId)
    const isOwner = company.createdBy.toString() === user._id.toString()
    const isHR = company.HRs.some((hr) => hr.toString() === user._id.toString())
    if (!isOwner && !isHR) {
      throw new ForbiddenException('You are not allowed');
    }



    return this.jobRepository.create(job)
  }

  findAll() {
    return `This action returns all job`;
  }

  async findOne(id: Types.ObjectId | string) {
    const job = await this.jobRepository.getOne({ _id: id }, {},
      { populate: [
        { path: 'companyId', select: 'name companyEmail' },
        { path: 'addedBy', select: 'firstName lastName fullName email' },
        { path: 'updatedBy', select: 'firstName lastName fullName email' }
      ] });
    if (!job) {
      throw new ForbiddenException('Job not found');
    }
    return job;
  }

  async update(id: Types.ObjectId, companyId: string, updateJobDto: UpdateJobDto, user: any) {
    await this.findOne(id)
    const company = await this.companyService.findOne(companyId)
    const isOwner = company.createdBy.toString() === user._id.toString()
    const isHR = company.HRs.some((hr) => hr.toString() === user._id.toString())
    if (!isOwner && !isHR) {
      throw new ForbiddenException('You are not allowed');
    }
    return await this.jobRepository.update({ _id: id }, { updateJobDto, updatedBy: user._id }, { new: true });
  }

  async remove(id: Types.ObjectId, companyId: string, user: any) {
    await this.findOne(id)
    const company = await this.companyService.findOne(companyId)
    const isOwner = company.createdBy.toString() === user._id.toString()
    const isHR = company.HRs.some((hr) => hr.toString() === user._id.toString())
    if (!isOwner && !isHR) {
      throw new ForbiddenException('You are not allowed');
    }
    await this.jobRepository.delete({ _id: id });
    return true;
  }

  async apply(id: Types.ObjectId, file: ImulterFile, user: any) {
    const job = await this.findOne(id)

    const existingApplication  = await this.applicationRepository.getOne({ jobId: id, userId: user._id })

    if (existingApplication) {
      throw new ForbiddenException('You have already applied for this job');
    }

    const fileUrl = await this.s3Service.uploadFile(file,`Applications/${id}/${user._id}`);
    const company = await this.companyService.findOne((job.companyId as any)._id.toString());


   await sendEmail({
      to: company.companyEmail,
      subject: 'New Application Received',
      html: `<p>
        You have received a new application for the job: ${job.jobTitle}<br/>
        user: ${user.firstName} ${user.lastName}<br/>
        application: ${fileUrl}
      </p>`
    })

    const application = await this.applicationRepository.create({
      jobId: id,
      userId: user._id,
      appliedAt: new Date(Date.now()),
      cvUrl: fileUrl
    })
    return application
  }
}
