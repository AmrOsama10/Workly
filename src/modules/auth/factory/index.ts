import { Provider, Role } from "@common/enum/index";
import { generateHash } from "@common/hashing";
import { RegisterDto } from "../dto/register.dto";
import { User } from "../entities/auth.entity.js";

export class AuthFactoryService {
    constructor() { }

    register(registerDto: RegisterDto) {
        const user = new User()
        user.fullName = registerDto.fullName
        user.email = registerDto.email
        user.password = generateHash(registerDto.password)
        user.mobileNumber = registerDto.mobileNumber
        user.gender = registerDto.gender
        user.DOB = registerDto.DOB
        user.provider = Provider.LOCAL
        user.role = Role.USER
        user.isVerified = false
        return user
    }

    googleLogin(payload:any) {
        const user = new User()
        user.fullName = payload.name
        user.email = payload.email
        user.provider = Provider.GOOGLE
        user.role = Role.USER
        user.isVerified = true
        return user
    }
}