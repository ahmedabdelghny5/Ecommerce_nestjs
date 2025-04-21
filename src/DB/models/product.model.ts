import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify"
import { User, Category, SubCategory, Brand } from './index';





@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Product {
    @Prop({ type: String, required: true, trim: true, minLength: 2 })
    name: string;

    @Prop({
        type: String,
        default: function () {
            return slugify(this.name, { lower: true, trim: true, replacement: "-" });
        }
    })
    slug: string;

    @Prop({ type: String, required: true, trim: true, minLength: 2 })
    description: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
    category: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: SubCategory.name, })
    subCategory: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: Brand.name, })
    brand: Types.ObjectId

    @Prop({ type: Object, required: true })
    mainImage: Object
    @Prop({ type: [Object] })
    subImages: Object[]

    @Prop({ type: String })
    customId: string

    @Prop({ type: Number, required: true })
    price: number

    @Prop({ type: Number, required: true, min: 1, max: 100 })
    discount: number

    @Prop({ type: Number, required: true })
    subPrice: number

    @Prop({ type: Number, required: true })
    stock: number

    @Prop({ type: Number, required: true })
    quantity: number


    @Prop({ type: Number })
    rateNum: number

    @Prop({ type: Number })
    rateAvg: number


}

export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductModel = MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
export type ProductDocument = HydratedDocument<Product>;