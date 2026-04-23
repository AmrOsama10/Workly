
import { ApplicationStatus } from "@common/index";
import { ApplicationRepository, CompanyRepository } from "@models/index";
import { CompanyService } from "@modules/company/company.service";
import { JobService } from "@modules/job/job.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class ApplicationService {
    constructor(
        private readonly applicationRepository: ApplicationRepository,
        private readonly companyRepository: CompanyRepository,
        private readonly companyService: CompanyService,
        private readonly jobService: JobService,

    ) { }

    async getAll(companyId: string, jobId: string, user: any) {
        const company = await this.companyService.findOne(companyId);

        const job = await this.jobService.findOne(jobId);

        if ((job.companyId as any)._id.toString() !== company._id.toString()) {
            throw new UnauthorizedException('This job does not belong to this company');
        }

        const isHr = company.HRs.map(hr => hr.toString()).includes(user._id.toString());
        const isOwner = company.createdBy.toString() === user._id.toString();

        if (!isHr && !isOwner) {
            throw new UnauthorizedException('You are not allowed to view these applications');
        }

        const applications = await this.applicationRepository.getAll({ jobId: job._id });

        return applications;
    }

    async getMyApplication(jobId: string, userId: string) {
        const application = await this.applicationRepository.getOne({ jobId, userId });
        if (!application) {
            throw new UnauthorizedException('Application not found');
        }
        return application;
    }

    async accept(id: string, userId: string) {
        const application = await this.applicationRepository.getOne({ _id: id });
        if (!application) {
            throw new UnauthorizedException('Application not found');
        }

        const job = await this.jobService.findOne(application.jobId.toString());
        
        const company = await this.companyService.findOne((job.companyId)._id.toString());

        const isHr = company.HRs.map(hr => hr.toString()).includes(userId.toString());
        const isOwner = (company.createdBy)._id.toString() === userId.toString();

        if (!isHr && !isOwner) {
            throw new UnauthorizedException('You are not allowed to accept this application');
        }

       const updatedApplication = await this.applicationRepository.update({ _id: application._id }, { status: ApplicationStatus.ACCEPTED }, { new: true });
        await this.companyRepository.update({ _id: company._id }, { numberOfEmployees: company.numberOfEmployees + 1 }, { new: true });
        return updatedApplication;
    }

    async reject(id: string, userId: string) {
        const application = await this.applicationRepository.getOne({ _id: id });
        if (!application) {
            throw new UnauthorizedException('Application not found');
        }

        const job = await this.jobService.findOne(application.jobId.toString());
        const company = await this.companyService.findOne((job.companyId)._id.toString());

        const isHr = company.HRs.map(hr => hr.toString()).includes(userId.toString());
        const isOwner = (company.createdBy)._id.toString() === userId.toString();

        if (!isHr && !isOwner) {
            throw new UnauthorizedException('You are not allowed to reject this application');
        }

       const updatedApplication = await this.applicationRepository.update({ _id: id }, { status: ApplicationStatus.REJECTED }, { new: true });
        return updatedApplication;
    }
}

