import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApplicationService } from "./application.service.js";
import { Auth, User } from "@common/index";


@Controller('application')
@Auth(['user', 'admin'])
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('company/:companyId/job/:jobId')
  async getAll(@Param() { companyId, jobId }: { companyId: string; jobId: string }, @User() user: any) {
    const applications = await this.applicationService.getAll(companyId, jobId, user);
    return {
      success: true,
      message: 'Applications retrieved successfully',
      applications,
    };
  }

  @Get('/:jobId/my-application')
  async getMyApplication(@Param('jobId') jobId:string , @User() user: any) {
    const application = await this.applicationService.getMyApplication(jobId, user._id);
    return {
      success: true,
      message: 'My application retrieved successfully',
      application,
    };
  }

  @Post('/:id/accept')
  async accept(@Param('id') id:string , @User() user: any) {
    const application = await this.applicationService.accept(id, user._id);
    return {
      success: true,
      message: 'Application accepted successfully',
      application,
    };
  }

  @Post('/:id/reject')
  async reject(@Param('id') id:string , @User() user: any) {
    const application = await this.applicationService.reject(id, user._id);
    return {
      success: true,
      message: 'Application rejected successfully',
      application,
    };
  }

}