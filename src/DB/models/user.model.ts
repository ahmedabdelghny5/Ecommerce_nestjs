import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Hash } from "../../common/security/Hash";
import { UserGender, UserRoles } from "../../common/types/types";
import { Encrypt } from './../../common/security/encryption';


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
    @Prop({ type: String, required: true, trim: true, minLength: 2, maxLength: 10 })
    name: string;
    @Prop({ type: String, required: true, trim: true, unique: true })
    email: string;
    @Prop({ type: String, required: true, trim: true, })
    password: string;
    @Prop({ type: Date, required: true })
    DOB: Date;
    @Prop({ type: Boolean })
    confirmed: boolean;
    @Prop({ type: Boolean })
    isDeleted: boolean;
    @Prop({ type: String, enum: UserRoles, default: UserRoles.user })
    role: string
    @Prop({ type: String, required: true, minLength: 11, maxLength: 11 })
    phone: string
    @Prop({ type: String, required: true })
    address: string
    @Prop({ type: String, required: true, enum: UserGender })
    gender: string
    
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", function (next) {
    if (this.isDirectModified("password")) {
        this.password = Hash(this.password)
    }
    if (this.isDirectModified("phone")) {
        this.phone = Encrypt(this.phone)
    }
    next()
})
export const userModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
export type UserDocument = HydratedDocument<User>;