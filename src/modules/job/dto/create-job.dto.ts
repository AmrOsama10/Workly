import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateJobDto {
    @IsString()
    @IsNotEmpty()
    jobTitle: string;
    
    @IsString()
    @IsNotEmpty()
    jobDescription: string;
    
    @IsString()
    @IsNotEmpty()
    jobLocation: string;
    
    @IsString()
    @IsNotEmpty()
    workingTime: string;
    
    @IsString()
    @IsNotEmpty()
    jobExperience: string;
    
    @IsArray()
    @IsNotEmpty()
    technicalSkills: string[];
    
    @IsArray()
    @IsNotEmpty()
    softSkills: string[];
    
    @IsBoolean()
    @IsOptional()
    closed: boolean;
    
}
