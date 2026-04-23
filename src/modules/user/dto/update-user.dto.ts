import { Gender } from "@common/enum"
import { Type } from "class-transformer"
import { IsDate, IsOptional, IsString, Length, MinLength } from "class-validator"

export class UpdateUserDto  {
    @IsOptional()
    @IsString()
    @MinLength(3)
    firstName?: string

    @IsOptional()
    @IsString()
    @MinLength(3)
    lastName?: string
    
    @IsString()
    @IsOptional()
    @Length(11)
    mobileNumber?: string
    
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    DOB?: string
    
    @IsOptional()
    @IsString()
    gender?: Gender
}
