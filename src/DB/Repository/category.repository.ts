import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./database.repository";
import { Category, CategoryDocument } from './../models/index';



@Injectable()
export class CategoryRepository extends DataBaseRepository<CategoryDocument> {
    constructor(@InjectModel(Category.name) private CategoryModel: Model<CategoryDocument>) {
        super(CategoryModel)
    }

}