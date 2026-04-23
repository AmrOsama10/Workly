import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Schema as MongooseSchema, Types } from "mongoose";
@Schema({ timestamps: true ,toJSON: { virtuals: true }, toObject: { virtuals: true }})
export class Job {   
    readonly _id: Types.ObjectId;
@Prop({ type: String, requd: true })
 jobTitle: string;
 
 @Prop({ type: String, required: true })
 jobDescription: string;
 
 @Prop({ type: String, required: true })
 jobLocation: string;
 
 @Prop({ type: String, required: true })
 workingTime: string;

 @Prop({ type: String, required: true })
 jobExperience: string;
 
 @Prop({ type: [String], required: true })
 technicalSkills: string[];
 
 @Prop({ type: [String], required: true })
 softSkills: string[];
 
 @Prop({ type: Boolean, default: false })
 closed: boolean;
 
 @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Company', required: true })
 companyId: Types.ObjectId;
 
 @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
 updatedBy: Types.ObjectId;
 
 @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
 addedBy: Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);

