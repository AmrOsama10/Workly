import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/auth.entity.js';
import { UserRepository } from '@models/index';
import { compareHash, confirmOtp, generateExpireAt, generateHash, generateOtp, generateToken, Provider, sendEmail } from '@common/index';
import { ForgetPasswordDto } from './dto/forget-password.dto.js';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { AuthFactoryService } from './factory/index.js';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly authFactoryService: AuthFactoryService,
    private readonly jwtService: JwtService
  ) { }

  async register(user: User) {
    const userExist = await this.userRepository.getOne({ email: user.email })
    if (userExist) {
      throw new BadRequestException('User already exists')
    }

    const userOtp = generateOtp()

    user.otp = generateHash(userOtp)
    user.otpExpireAt = generateExpireAt()

    const created = await this.userRepository.create(user)

    await sendEmail({
      to: user.email,
      subject: 'confirm email',
      text: `<h1>your otp is ${userOtp}</h1>`,
    })

    const { otp, otpExpireAt, password, ...userObject } = JSON.parse(JSON.stringify(created))
    const dob = new Date(userObject.DOB)

    userObject.DOB = `${dob.getDate()}-${dob.getMonth() + 1}-${dob.getFullYear()}`


    return userObject as User


  }

  async login(loginDto: LoginDto) {
    const userExist = await this.userRepository.getOne({ email: loginDto.email })
    if (!userExist) {
      throw new UnauthorizedException("invalid credentials")
    }
    if (userExist.provider === Provider.GOOGLE) {
      throw new UnauthorizedException("invalid credentials")
    }
    const matchPasswodr = compareHash(loginDto.password, userExist.password)
    if (!matchPasswodr) {
      throw new UnauthorizedException("invalid credentials")
    }
    if (userExist.deletedAt) {
      userExist.deletedAt = undefined as unknown as Date
      await userExist.save()
    }

    if (userExist.bannedAt) {
      throw new UnauthorizedException("User is banned")
    }


    const token = this.jwtService.signAsync({ id: userExist._id, email: userExist.email }, {
      expiresIn: '1h',
      secret: this.configService.get('jwt').secretKey,
    })
    return token

  }

  async isVerified(otp: string, email: string) {
    const userExist = await this.userRepository.getOne({ email })
    if (!userExist) throw new NotFoundException("user not found")
    confirmOtp(otp, userExist)
    userExist.isVerified = true
    await userExist.save()
    return userExist
  }



  async sendOtp(email: string) {
    const userExist = await this.userRepository.getOne({ email })
    if (!userExist) {
      throw new BadRequestException('User not found')
    }

    const userOtp = generateOtp()

    userExist.otp = generateHash(userOtp)
    userExist.otpExpireAt = generateExpireAt()
    await userExist.save()

    await sendEmail({
      to: userExist.email,
      subject: 'confirm email',
      text: `<h1>your otp is ${userOtp}</h1>`,
    })


  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const userExist = await this.userRepository.getOne({ email: forgetPasswordDto.email })
    if (!userExist) {
      throw new BadRequestException('User not found')
    }
    confirmOtp(forgetPasswordDto.otp, userExist)
    userExist.password = generateHash(forgetPasswordDto.newPassword)
    await userExist.save()
    return userExist
  }

  async googleLogin(idToken: string) {
    // TODO: Implement Google login logic
    const client = new OAuth2Client(
      this.configService.get('google').clientId
    );
    const ticket = await client.verifyIdToken({ idToken })
    const payload = ticket.getPayload()
    if (!payload) {
      throw new UnauthorizedException('Invalid token')
    }
    const userExist = await this.userRepository.getOne({ email: payload.email })

    if (!userExist) {
      const newUser = this.authFactoryService.googleLogin(payload)
      return await this.userRepository.create(newUser)
    }

    return userExist


  }

}


