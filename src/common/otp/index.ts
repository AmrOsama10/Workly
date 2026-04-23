import { compareHash } from "@common/hashing";
import { BadRequestException } from "@nestjs/common";

export const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString()
};

export const generateExpireAt = (time?: number) => {
    return new Date(Date.now() + (time ?? 1000 * 60 * 10));
};  

export const confirmOtp = (otp: string, userExist: any) => {

    if (userExist.otpExpireAt < new Date(Date.now())) {
      throw new BadRequestException('otp expired')
    }

    const otpHash = compareHash(otp, userExist.otp)

    if (!otpHash) {
      throw new BadRequestException('invalid otp')
    }
}