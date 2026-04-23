import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity.js';
import { UserRepository } from '@models/index';
import { UpdatePasswordDto } from './dto/update-passwor.dto.js';
import { compareHash, generateHash } from '@common/hashing';
import { Types } from 'mongoose';
import { ImulterFile } from '@common/interfaces/multer-options-interface';
import { S3Service } from '@shared/index';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service
  ) { }


  async update(userId: string, newUser: Partial<User>) {
    const updatedUser = await this.userRepository.update({ _id: userId }, newUser)
    return updatedUser;
  }

  async getOne(userId: string) {
    const userExist = await this.userRepository.getOne({ _id: userId }, {}, {
      select: '-password -otp -otpExpireAt'
    })
    if (!userExist) throw new NotFoundException("user not found ")

    return userExist;
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto, user: any) {
    const userExist = await this.userRepository.getOne({ _id: user._id })
    if (!userExist) throw new NotFoundException("user not found")

    const matchPassword = compareHash(updatePasswordDto.oldPassword, userExist.password)
    if (!matchPassword) throw new UnauthorizedException("Invalid password")

    user.password = generateHash(updatePasswordDto.newPassword)
    await user.save()

    return user;
  }

  async deleteAccount(userId: string) {
    const deletedUser = await this.userRepository.update({ _id: userId },
      {
        deletedAt: new Date(),
        credentionalUpdatedAt: new Date()
      })
    return deletedUser;
  }

  async banUser(userId: string) {
    const user = await this.userRepository.getOne({ _id: userId })
    if (!user) throw new NotFoundException("user not found")

    if (user.deletedAt) throw new UnauthorizedException("User is deleted")

    if (user.bannedAt) throw new UnauthorizedException("User already banned")

    const updatedUser = await this.userRepository.update({ _id: userId }, {
      bannedAt: new Date(),
      credentionalUpdatedAt: new Date()
    },{new:true})

    return updatedUser;
  }
  async unBanUser(userId: string) {
    const user = await this.userRepository.getOne({ _id: userId })
    if (!user) throw new NotFoundException("user not found")

    if (!user.bannedAt) throw new UnauthorizedException("User is not banned")
    const updatedUser = await this.userRepository.update({ _id: userId }, {
     $unset: { bannedAt: '' },
     credentionalUpdatedAt: new Date()
    },{new:true})
    

    return updatedUser;
  }
  
  async updateProfilePicture(userId: string, file: ImulterFile) {
    const user = await this.userRepository.getOne({ _id: userId })
    if (user?.profilePicture) {
      await this.s3Service.deleteFile(user.profilePicture).catch(() => null);
    }
    
    const imageUrl = await this.s3Service.uploadFile(file, `User/${userId}/profile-picture`);
    const updatedUser = await this.userRepository.update({ _id: userId }, {
      profilePicture: imageUrl,
    },{new:true})
    
    return updatedUser;
  }

  async deleteProfilePicture(userId: string) {
    const user = await this.userRepository.getOne({ _id: userId })
    if (!user?.profilePicture) {
      throw new NotFoundException('Profile picture not found');
    }
    if (user?.profilePicture) {
      await this.s3Service.deleteFile(user.profilePicture).catch(() => null);
    }
    
    return await this.userRepository.update({ _id: userId }, {
      $unset: { profilePicture: '' },
    },{new:true})
  }
  
  async updateProfileCoverPicture(userId: string, file: ImulterFile) {
    const user = await this.userRepository.getOne({ _id: userId })
    if (user?.profileCoverPicture) {
      await this.s3Service.deleteFile(user.profileCoverPicture).catch(() => null);
    }
    
    const imageUrl = await this.s3Service.uploadFile(file, `User/${userId}/profile-cover-picture`);
    const updatedUser = await this.userRepository.update({ _id: userId }, {
      profileCoverPicture: imageUrl,
    },{new:true})
    
    return updatedUser;
  }

  async deleteProfileCoverPicture(userId: string) {
    const user = await this.userRepository.getOne({ _id: userId })
    if (!user?.profileCoverPicture) {
      throw new NotFoundException('Profile cover picture not found');
    }
    if (user?.profileCoverPicture) {
      await this.s3Service.deleteFile(user.profileCoverPicture).catch(() => null);
    }
    
    return await this.userRepository.update({ _id: userId }, {
      $unset: { profileCoverPicture: '' },
    },{new:true})
  }
}
