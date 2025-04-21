import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../models/user.model";
import { FilterQuery, Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { DataBaseRepository } from "./database.repository";



@Injectable()
export class UserRepository extends DataBaseRepository<UserDocument> {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {
        super(UserModel)
    }

}