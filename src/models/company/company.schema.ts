import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Company {
    readonly _id: string;
    @Prop({ type: String, required: true, unique: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    industry: string;

    @Prop({ type: String, required: true })
    address: string;

    @Prop({ type: Number, default: 0 })
    numberOfEmployees: number;

    @Prop({ type: String, required: true, unique: true })
    companyEmail: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: mongoose.Types.ObjectId;

    @Prop({ type: [Types.ObjectId], default: [] })
    HRs: mongoose.Types.ObjectId[];

    @Prop({ type: Date })
    bannedAt: Date;

    @Prop({ type: Date })
    deletedAt: Date;

    @Prop({ type: Boolean, default: false })
    approvedByAdmin: boolean;

    @Prop({ type: String })
    logo: string;

    @Prop({ type: String })
    coverImage: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

