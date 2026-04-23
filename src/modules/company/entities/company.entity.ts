import mongoose from "mongoose";

export class Company {
     readonly _id: string;
           name: string;
           description: string;
           industry: string;
           address: string;
           numberOfEmployees: number;
           companyEmail: string;
           createdBy: mongoose.Types.ObjectId;
           HRs: mongoose.Types.ObjectId[];
           bannedAt: Date;
           deletedAt: Date;
           approvedByAdmin: boolean;
           logo: string;
           coverImage: string;
}
