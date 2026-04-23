
import { Provider, Gender, Role, OtpType } from "@common/enum";

export class User {
      _id: string;
       firstName: string;
       lastName: string;
       fullName: string;
       email: string
       password: string;      
       provider: Provider;
       gender: Gender;
       mobileNumber: string;
       role: Role;
       isVerified: boolean;
       otp: string;
       otpExpireAt: Date;
       DOB: Date
}
