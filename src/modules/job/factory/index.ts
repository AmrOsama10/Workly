import { User } from "@models/index";
import { CreateJobDto } from "../dto/create-job.dto";
import { Job } from "../entities/job.entity";
import { Schema, Types } from "mongoose";

export class JobFactoryService {
    createJob(createJobDto: CreateJobDto, user: User ,companyId: string) {
        const job = new Job()
        
        job.jobTitle = createJobDto.jobTitle
        job.jobDescription = createJobDto.jobDescription
        job.jobLocation = createJobDto.jobLocation
        job.workingTime = createJobDto.workingTime
        job.jobExperience = createJobDto.jobExperience
        job.technicalSkills = createJobDto.technicalSkills
        job.softSkills = createJobDto.softSkills
        job.closed = createJobDto.closed
        job.companyId = new Types.ObjectId(companyId)
        job.updatedBy = new Types.ObjectId(user._id)
        job.addedBy = new Types.ObjectId(user._id)
        
        return job
    }
}