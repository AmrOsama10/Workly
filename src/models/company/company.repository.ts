import { AbstractRepository } from "@models/abstract.repository";
import { Company } from "./company.schema";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CompanyRepository extends AbstractRepository<Company> {
    constructor(@InjectModel(Company.name) private readonly companyModel: Model<Company>){
        super(companyModel)
    }
}