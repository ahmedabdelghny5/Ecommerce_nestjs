import { InjectModel } from "@nestjs/mongoose";
import {  Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./database.repository";
import { Cart, CartDocument } from '../models/index';



@Injectable()
export class CartRepository extends DataBaseRepository<CartDocument> {
    constructor(@InjectModel(Cart.name) private CartModel: Model<CartDocument>) {
        super(CartModel)
    }

}