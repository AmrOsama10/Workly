import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Auth, Public, User } from '@common/decorator';
import { CompanyFactoryService } from './factory/index.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudMulter, CloudStorage } from '@common/multer/cloud.multer';


@Controller('company')
@Auth(['admin','user'])
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyFactoryService: CompanyFactoryService
  ) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto,@User() user: any) {
    const company = this.companyFactoryService.createCompany(createCompanyDto,user);
    const createdCompany = await this.companyService.create(company,user);
    return {
      message: 'Company created successfully',
      success: true,
      data: createdCompany
    };
  }


  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.companyService.findOne(id);
    return {
      message: 'Company found successfully',
      success: true,
      data: company
    };
  }

  @Public()
  @Get('name/:name')
  async findOneByName(@Param('name') name: string) {
    const company = await this.companyService.findOneByName(name);
    return {
      message: 'Company found successfully',
      success: true,
      data: company
    };
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto ,@User() user: any) {
    const company = await this.companyService.update(id, updateCompanyDto,user);
    return {
      message: 'Company updated successfully',
      success: true,
      data: company
    };
  }

  @Post(':id/add-hr')
  async addHr(@Param('id') id: string, @Body() body: { hrIds: string[] }, @User() user: any) {
    const company = await this.companyService.addHr(id, body.hrIds, user);
    return {
      message: 'HR added successfully',
      success: true,
      data: company
    };
  }

  @Delete(':id/remove-hr')
  async removeHr(@Param('id') id: string , @Body() body: { hrId: string }, @User() user: any) {
    const company = await this.companyService.removeHr(id, body.hrId, user);
    return {
      message: 'HR removed successfully',
      success: true,
      data: company
    };
  }
  
  @Delete(':id')
  async delete(@Param('id') id: string , @User() user: any) {
    await this.companyService.delete(id, user);
    return {
      message: 'Company deleted successfully',
      success: true,
    };
  }

  @UseInterceptors(FileInterceptor('logo',cloudMulter({storageApproach:CloudStorage.DISK})))
  @Patch('upload-logo/:id')
  async updateLogo(@Param('id') id: string, @UploadedFile() file: Express.Multer.File ,@User() user: any) {
    const company = await this.companyService.updateLogo(id, file, user);
    return {
      message: 'Logo uploaded successfully',
      success: true,
      data: company?.logo
    };
  }
  
  @Delete('delete-logo/:id')
  async deleteLogo(@Param('id') id: string, @User() user: any) {
    const company = await this.companyService.deleteLogo(id, user);
    return {
      message: 'Logo deleted successfully',
      success: true,
      data: company?.logo
    };
  }
  @UseInterceptors(FileInterceptor('cover',cloudMulter({storageApproach:CloudStorage.DISK})))
  @Patch('upload-cover/:id')
  async updateCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File ,@User() user: any) {
    const company = await this.companyService.updateCover(id, file, user);
    return {
      message: 'Cover uploaded successfully',
      success: true,
      data: company?.coverImage
    };
  }
  
  @Delete('delete-cover/:id')
  async deleteCover(@Param('id') id: string, @User() user: any) {
    const company = await this.companyService.deleteCover(id, user);
    return {
      message: 'Cover deleted successfully',
      success: true,
      data: company?.coverImage
    };
  }

}
