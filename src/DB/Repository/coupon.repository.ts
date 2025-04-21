import { InjectModel } from "@nestjs/mongoose";
import {  Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./database.repository";
import { Coupon, CouponDocument } from '../models/index';



@Injectable()
export class CouponRepository extends DataBaseRepository<CouponDocument> {
    constructor(@InjectModel(Coupon.name) private CouponModel: Model<CouponDocument>) {
        super(CouponModel)
    }

}