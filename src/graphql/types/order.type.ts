import { Types } from "mongoose";
import { Order } from "../../DB/models/order.model";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { OrderStatusTypes, PaymentMethodTypes } from "../../common/types/types";
import { Cart } from "../../DB/models/cart.model";



registerEnumType(OrderStatusTypes, { name: "OrderStatusTypes" })
registerEnumType(PaymentMethodTypes, { name: "PaymentMethodTypes" })






@ObjectType()
class CartProductType {
    @Field(() => ID, { nullable: false })
    productId: Types.ObjectId
    @Field(() => Number, { nullable: false })
    quantity: number
    @Field(() => Number, { nullable: false })
    finalPrice: number
}

@ObjectType()
class CartType implements Partial<Cart> {
    @Field(() => ID, { nullable: false })
    userId?: Types.ObjectId | undefined;
    @Field(() => [CartProductType], { nullable: false })
    products?: { productId: Types.ObjectId; quantity: number; finalPrice: number; }[] | undefined;
    @Field(() => Number, { nullable: false })
    subTotal?: number | undefined;
}



@ObjectType()
export class OrderType implements Partial<Order> {
    @Field(() => ID, { nullable: false })
    _id: Types.ObjectId
    @Field(() => ID, { nullable: false })
    userId?: Types.ObjectId | undefined;
    @Field(() => CartType, { nullable: false })
    cartId?: Types.ObjectId | undefined;
    @Field(() => String, { nullable: false })
    address?: string | undefined;
    @Field(() => String, { nullable: false })
    phone?: string | undefined;
    @Field(() => Number, { nullable: false })
    totalPrice?: number | undefined;
    @Field(() => OrderStatusTypes, { nullable: false })
    status?: string | undefined;
    @Field(() => PaymentMethodTypes, { nullable: false })
    paymentMethod?: string | undefined;

}