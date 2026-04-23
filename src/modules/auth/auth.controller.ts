import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthFactoryService } from './factory/index.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgetPasswordDto } from './dto/forget-password.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFactoryService: AuthFactoryService
  ) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authFactoryService.register(registerDto)
    const userCreated = await this.authService.register(user)
    return {
      message: 'User created successfully',
      success: true,
      data: userCreated
    }
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return {
      message: 'User logged in successfully',
      success: true,
      data: token
    };
  }

  @Post('verify')
  async isVerified(@Body() { otp, email }: { otp: string; email: string }) {
    await this.authService.isVerified(otp, email);
    return {
      message: 'user verified successfully',
      success: true
    };
  }

  
    @Post('forget-password')
    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
      await this.authService.forgetPassword(forgetPasswordDto);
      return {
        message: 'User password reset successfully',
        success: true,
      }
    }
  
    @Post('send-otp')
    async sendOtp(@Body() { email }: { email: string }) {
      await this.authService.sendOtp(email);
      return {
        message: 'Otp sent successfully',
        success: true,
      }
    }

  @Post('/google-login') 
    async googleLogin(@Body('idToken') idToken: string ) {
      const user = await this.authService.googleLogin(idToken);
      return {
        message: 'Google login successfully',
        success: true,
        data: user
      }
    }

}
