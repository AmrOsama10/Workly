
import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    @Length(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    @Length(10, 500)
    description: string;

    @IsString()
    @IsNotEmpty()
    industry: string;
    
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsEmail()
    @IsEmail()
    @IsNotEmpty()
    companyEmail: string;

}
