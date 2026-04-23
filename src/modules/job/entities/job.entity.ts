import { Schema, Types } from "mongoose";

export class Job {
     readonly _id: Types.ObjectId;
    
     jobTitle: string;
     jobDescription: string;
     jobLocation: string;
     workingTime: string;
     jobExperience: string;     
     technicalSkills: string[];
     softSkills: string[];
     closed: boolean;
     companyId:  Types.ObjectId;
     updatedBy: Types.ObjectId;
     addedBy: Types.ObjectId;
}
