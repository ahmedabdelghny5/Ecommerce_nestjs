import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./database.repository";
import { Brand, BrandDocument } from './../models/index';



@Injectable()
export class BrandRepository extends DataBaseRepository<BrandDocument> {
    constructor(@InjectModel(Brand.name) private BrandModel: Model<BrandDocument>) {
        super(BrandModel)
    }

}