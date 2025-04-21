import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify"
import { User } from './user.model';



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Category {
    @Prop({ type: String, required: true, unique: true, trim: true, minLength: 2, lowercase: true })
    name: string;

    @Prop({
        type: String,
        default: function () {
            return slugify(this.name, { lower: true, trim: true, replacement: "-" });
        }
    })
    slug: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId

    @Prop({ type: Object })
    image: Object

    @Prop({ type: String })
    customId: string

}

export const CategorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])
export type CategoryDocument = HydratedDocument<Category>;