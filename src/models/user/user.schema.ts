
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Gender, Provider, Role } from "@common/enum";
import { Types } from "mongoose";

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
   readonly _id: string;

    @Prop({ type: String, trim: true, required() {
            if (this.provider === Provider.LOCAL) {
                return true;
            }
            return false;
        } })
    firstName: string;

    @Prop({ type: String, trim: true, required() {
            if (this.provider === Provider.LOCAL) {
                return true;
            }
            return false;
        } })
    lastName: string;

   

    @Prop({ type: String, required: true, trim: true, unique: true })
    email: string;

    @Prop({
        type: String, required() {
            if (this.provider === Provider.LOCAL) {
                return true;
            }
            return false;
        }
    })
    password: string;

    @Prop({ type: String, enum: Provider, default: Provider.LOCAL })
    provider: string;

    @Prop({ type: String, enum: Gender })
    gender: string;

    @Prop({ type: String }) 
    mobileNumber: string;

    @Prop({ type: String, enum: Role, default: Role.USER })
    role: string;

    @Prop({ type: Boolean, default: false })
    isVerified: boolean;

    @Prop({ type: String })
    otp: string;
    
    @Prop({ type: Date })
    otpExpireAt: Date;

    @Prop({ type: Date })
    DOB: Date

    @Prop({ type: Date })
    deletedAt: Date

    @Prop({ type: Date })
    credentionalUpdatedAt: Date

    @Prop({ type: Date })
    bannedAt: Date

    @Prop({ type: String })
    profilePicture: string;

    @Prop({ type: String })
    profileCoverPicture: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
}).set(function (value: string) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName as string;
    this.lastName = lName as string;
});