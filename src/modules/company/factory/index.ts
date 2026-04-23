
import { Injectable } from "@nestjs/common";
import { Company } from "../entities/company.entity.js";
import { CreateCompanyDto } from "../dto/create-company.dto.js";

@Injectable()
export class CompanyFactoryService {
    createCompany(companyDto: CreateCompanyDto, user: any) {
        const company = new Company();
        company.name = companyDto.name;
        company.description = companyDto.description;
        company.industry = companyDto.industry;
        company.address = companyDto.address;
        company.companyEmail = companyDto.companyEmail;
        company.createdBy = user.id;
        company.HRs = [user.id];
        company.numberOfEmployees = 1;
        return company;
    }
}
