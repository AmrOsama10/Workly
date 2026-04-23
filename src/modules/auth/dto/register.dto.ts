import { Gender } from "@common/enum";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsString, Length, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(6)
    fullName:string;
    
    @IsEmail()
    email:string;
    
    @IsString()
    @MinLength(8)
    password:string;
    
    @IsString()
    @Length(11)
    mobileNumber:string;
    
    @IsString()
    gender:Gender;
    
    @Type(() => Date)
    @IsDate()
    DOB:Date;
}
