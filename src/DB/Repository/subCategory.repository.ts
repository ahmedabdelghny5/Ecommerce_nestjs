import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./database.repository";
import { SubCategory, SubCategoryDocument } from '../models/index';



@Injectable()
export class SubCategoryRepository extends DataBaseRepository<SubCategoryDocument> {
    constructor(@InjectModel(SubCategory.name) private SubCategoryModel: Model<SubCategoryDocument>) {
        super(SubCategoryModel)
    }

}