import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from './index';
import { OTPTypes } from "../../common/types/types";





@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class OTP {
    @Prop({ type: String, required: true, })
    otp: string;

    @Prop({ type: Date, required: true })
    expireAt: Date;

    @Prop({ type: String, enum: OTPTypes, required: true, })
    otpTypes: string

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId

}

export const OTPSchema = SchemaFactory.createForClass(OTP);
export const OTPModel = MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])
export type OTPDocument = HydratedDocument<OTP>;