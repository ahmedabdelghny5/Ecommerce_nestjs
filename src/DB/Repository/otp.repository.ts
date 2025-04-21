import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./database.repository";
import { OTPDocument, OTP } from "../models/index";
import { OTPTypes } from "../../common/types/types";


interface OtpOptions {
    otp: string,
    expireAt?: Date,
    otpTypes: OTPTypes,
    userId: Types.ObjectId
}

@Injectable()
export class OTPRepositoryService extends DataBaseRepository<OTPDocument> {
    constructor(@InjectModel(OTP.name) private OTPModel: Model<OTPDocument>) {
        super(OTPModel)
    }

    createOtp({ otp, expireAt, otpTypes, userId }: OtpOptions) {
        return this.create({
            otp,
            expireAt: expireAt || new Date(Date.now() + 1000 * 60 * 10),// 10 min
            otpTypes,
            userId
        })
    }

}