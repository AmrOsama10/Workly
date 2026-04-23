import { AbstractRepository } from "@models/abstract.repository";
import { Job } from "./job.schema.js";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JobRepository extends AbstractRepository<Job> {
    constructor(@InjectModel(Job.name) private readonly jobModel: Model<Job>) {
        super(jobModel);
    }
}
