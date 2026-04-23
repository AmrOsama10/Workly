import { Auth, Public, User } from '@common/decorator';
import type { ImulterFile } from '@common/interfaces';
import { cloudMulter, CloudStorage } from '@common/multer/cloud.multer';
import { Body, Controller, Delete, Get, Param, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePasswordDto } from './dto/update-passwor.dto.js';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFactoryService } from './factory/index';
import { UserService } from './user.service';

@Controller('user')
@Auth(['user','admin'])
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userFactoryService: UserFactoryService,
  ) {}


  @Patch('update-profile')
  update( @Body() updateUserDto: UpdateUserDto,@User() user:any) {
    const newUser = this.userFactoryService.updateUser(updateUserDto,user)
    this.userService.update(user._id,newUser);
    return {
      message:"User updated successfully",
      success:true,
      data:newUser
    };
  }

  @Get('profile')
  async profile(@User() user:any) {
    const profile =await this.userService.getOne(user._id)
    return {
      message:"User profile",
      success:true,
      data:profile
    };
  }
  @Get(':id')
  @Public()
  async getUser(@Param('id') id:string) {
    const profile =await this.userService.getOne(id)
    return {
      message:"User profile",
      success:true,
      data:profile
    };
  }

  @Patch('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto,@User() user:any) {
     await this.userService.updatePassword(updatePasswordDto,user);
    return {
      message:"User updated successfully",
      success:true,
      
    };
  }

  @Delete('delete-account')
  async deleteAcount(@User() user:any){
      await this.userService.deleteAccount(user._id);
    return {
      message:"User deleted successfully",
      success:true,
    };
  }

  // @UseInterceptors(FileInterceptor('profilePicture', multerLocalOptions({ folder: 'User' })))
  // @Patch('update-profile-picture')
  // async updateProfilePicture(@UploadedFile() file: ImulterFile,@User() user:any) {
  //   // await this.userService.updateProfilePicture(user._id,updateProfilePictureDto.profilePicture);
  //   console.log(file);
    
  //   return {
  //     message:"User profile picture updated successfully",
  //     success:true,
  //   };
  // }


  @UseInterceptors(FileInterceptor('profilePicture', cloudMulter()))
  @Patch('update-profile-picture')
  async updateProfilePicture(@UploadedFile() file: ImulterFile,@User() user:any) {  
   const userUpdated = await this.userService.updateProfilePicture(user._id,file);
    return {
      message:"User profile picture updated successfully",
      success:true,
      data:userUpdated?.profilePicture
    };
  }

  @Delete('delete-profile-picture')
  async deleteProfilePicture(@User() user:any) {  
    await this.userService.deleteProfilePicture(user._id);
    return {
      message:"User profile picture deleted successfully",
      success:true,
    };
  }
  @UseInterceptors(FileInterceptor('profileCoverPicture', cloudMulter()))
  @Patch('update-profile-cover-picture')
  async updateProfileCoverPicture(@UploadedFile() file: ImulterFile,@User() user:any) {  
   const userUpdated = await this.userService.updateProfileCoverPicture(user._id,file);
    return {
      message:"User profile cover picture updated successfully",
      success:true,
      data:userUpdated?.profileCoverPicture
    };
  }

  @Delete('delete-profile-cover-picture')
  async deleteProfileCoverPicture(@User() user:any) {  
    await this.userService.deleteProfileCoverPicture(user._id);
    return {
      message:"User profile cover picture deleted successfully",
      success:true,
    };
  }


}
