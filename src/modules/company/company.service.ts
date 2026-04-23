import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { CompanyRepository, UserRepository } from '@models/index';
import { Types } from 'mongoose';
import { S3Service } from '@shared/index';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
    private readonly s3service: S3Service,
  ) { }
  async create(company: Company, user: any) {
    const nameExist = await this.companyRepository.getOne({
      name: company.name
    });

    if (nameExist) {
      throw new BadRequestException('Company name already exists');
    }

    const emailExist = await this.companyRepository.getOne({
      companyEmail: company.companyEmail
    });

    if (emailExist) {
      throw new BadRequestException('Company email already exists');
    }

    const userExist = await this.userRepository.getOne({ email: company.companyEmail });
    if (userExist) {
      throw new BadRequestException('Email already used by a user');
    }

    return this.companyRepository.create(company);
  }

  async findOne(id: string ) {
    const company = await this.companyRepository.getOne({ _id: id },
      {},
      { populate: { path: 'createdBy', select: 'firstName lastName email' } });

    if (!company || company.deletedAt) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async findOneByName(name: string) {
    const company = await this.companyRepository.getAll({
      name: { $regex: name, $options: 'i' }
    },
    {},
    { populate: { path: 'createdBy', select: 'firstName lastName email' } });

    if (!company || company.length === 0 || company.some(c => c.deletedAt)) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: any) {
    const companyExist = await this.findOne(id);

    if (companyExist.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed');
    }

    const updatedCompany = await this.companyRepository.update({ _id: id }, updateCompanyDto, { new: true });
    return updatedCompany;
  }

  async delete(id: string, user: any) {
    const companyExist = await this.findOne(id);

    if (companyExist.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed');
    }

    return await this.companyRepository.update({ _id: id }, { deletedAt: new Date() });
  }

  async addHr(id: string, hrIds: string[], user: any) {
    const company = await this.findOne(id);

    if (company.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed');
    }

    const users = await this.userRepository.getAll({
      _id: { $in: hrIds }
    });

    if (users.length !== hrIds.length) {
      throw new BadRequestException('One or more users not found');
    }

    const hrExists = company.HRs.map((hr) => hr.toString()).some((hr) => hrIds.includes(hr));
    if (hrExists) {
      throw new BadRequestException('HR already exists in company');
    }

    return await this.companyRepository.update(
      { _id: id },
      { $addToSet: { HRs: { $each: hrIds } }, $set: { numberOfEmployees: hrIds.length } },
      { new: true }
    );
  }

  async removeHr(id: string, hrId: string, user: any) {
    const company = await this.findOne(id);

    if (company.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed');
    }

    const hr = company.HRs.map((hr) => hr.toString()).includes(hrId);
    if (!hr) {
      throw new BadRequestException('HR not found in company');
    }

    return await this.companyRepository.update(
      { _id: id },
      { $pull: { HRs: hrId }, $set: { numberOfEmployees: company.HRs.length - 1 } },
      { new: true }
    );
  }

  async updateLogo(id: string, file: Express.Multer.File, user: any) {
    const company = await this.findOne(id);
    if (company.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed');
    }
    if (company.logo) {
      await this.s3service.deleteFile(company.logo).catch(() => null);
    }

    const logoUrl = await this.s3service.uploadFile(file, `companies/${id}/logo`);
    const updatedCompany = await this.companyRepository.update({ _id: id }, { logo: logoUrl }, { new: true });
    return updatedCompany;
  }
  
  async deleteLogo(id: string , user: any) {
    const company = await this.findOne(id);
    if (company.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed');
    }
    if (!company.logo) {
      throw new NotFoundException('Company logo not found');
    }
    if (company.logo) {
      await this.s3service.deleteFile(company.logo).catch(() => null);
    }

    const updatedCompany = await this.companyRepository.update({ _id: id }, { $unset: { logo: '' } }, { new: true });
    return updatedCompany;
  }
  async updateCover(id: string, file: Express.Multer.File, user: any) {
    const company = await this.findOne(id);
    if (company.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed');
    }
    if (company.coverImage) {
      await this.s3service.deleteFile(company.coverImage).catch(() => null);
    }

    const coverUrl = await this.s3service.uploadFile(file, `companies/${id}/cover`);
    const updatedCompany = await this.companyRepository.update({ _id: id }, { coverImage: coverUrl }, { new: true });
    return updatedCompany;
  }
  
  async deleteCover(id: string , user: any) {
    const company = await this.findOne(id);
    if (company.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed');
    }
    if (!company.coverImage) {
      throw new NotFoundException('Company cover not found');
    }
    if (company.coverImage) {
      await this.s3service.deleteFile(company.coverImage).catch(() => null);
    }

    const updatedCompany = await this.companyRepository.update({ _id: id }, { $unset: { coverImage: '' } }, { new: true });
    return updatedCompany;
  }


}
