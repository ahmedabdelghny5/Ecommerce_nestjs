import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./database.repository";
import { Product, ProductDocument } from '../models/index';



@Injectable()
export class ProductRepository extends DataBaseRepository<ProductDocument> {
    constructor(@InjectModel(Product.name) private ProductModel: Model<ProductDocument>) {
        super(ProductModel)
    }

}