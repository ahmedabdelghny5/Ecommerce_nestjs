import { InjectModel } from "@nestjs/mongoose";
import {  Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./database.repository";
import { Order, OrderDocument } from '../models/index';



@Injectable()
export class OrderRepository extends DataBaseRepository<OrderDocument> {
    constructor(@InjectModel(Order.name) private OrderModel: Model<OrderDocument>) {
        super(OrderModel)
    }
}