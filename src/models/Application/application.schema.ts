import { ApplicationStatus } from "@common/enum/index";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { SchemaTypes } from "mongoose";

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Application {
    @Prop({ type: SchemaTypes.ObjectId, ref: 'Job', required: true })
    jobId: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;
    
    @Prop({ type: String })
    cvUrl: string;

    @Prop({ type: String, enum: ApplicationStatus, default: ApplicationStatus.PENDING })
    status: string;

    @Prop({ type: Date })
    appliedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);