import { UpdateUserDto } from "../dto/update-user.dto.js";
import { User } from "../entities/user.entity.js";

export class UserFactoryService {
    
    updateUser(updateUserDto: UpdateUserDto,user:any) {
        
        return {
            
            firstName : updateUserDto.firstName ?? user.firstName,
            lastName : updateUserDto.lastName ?? user.lastName,
            mobileNumber : updateUserDto.mobileNumber ?? user.mobileNumber,
            dob : updateUserDto.DOB ?? user.dob,
            gender : updateUserDto.gender ?? user.gender
        }
    }
}