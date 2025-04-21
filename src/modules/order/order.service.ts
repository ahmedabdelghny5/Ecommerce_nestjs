import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/DB/models';
import { CartRepository, OrderRepository } from 'src/DB/Repository';
import { CreateOrderDto } from './dto/order.dto';

import { OrderStatusTypes, PaymentMethodTypes } from 'src/common/types/types';
import { PaymentService } from './service/payment';

@Injectable()
export class OrderService {

    constructor(
        private readonly _orderRepository: OrderRepository,
        private readonly _cartRepository: CartRepository,
        private readonly PaymentService: PaymentService
    ) { }
    // ================== create order=================
    async createOrder(user: UserDocument, body: CreateOrderDto) {
        const { address, phone, paymentMethod } = body

        const cart = await this._cartRepository.findOne({ userId: user._id })
        if (!cart || cart.products.length == 0) {
            throw new BadRequestException('Cart not found');
        }

        const order = await this._orderRepository.create({
            userId: user._id,
            cartId: cart._id,
            totalPrice: cart.subTotal,
            phone,
            address,
            paymentMethod,
            status: paymentMethod == PaymentMethodTypes.cash ? OrderStatusTypes.placed : OrderStatusTypes.pending
        })


        // dec product stock {$inc:{-product.quantity}}
        // clear cart
        // push id user to usedBy field of coupon

        return { order }

    }



    // ============payment with stripe================
    async paymentWithStripe(user: UserDocument, orderId: string) {

        const order = await this._orderRepository.findOne(
            { _id: orderId, status: OrderStatusTypes.pending },
            [{ path: "cartId", populate: [{ path: "products.productId" }] }]
        )
        if (!order) {
            throw new BadRequestException('Order not found');
        }

        const session = await this.PaymentService.createSession({
            customer_email: user.email,
            metadata: { orderId: order._id.toString() },
            line_items: order.cartId["products"].map((product) => ({
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: product.productId.name,
                        images: [product.productId.mainImage.secure_url]
                    },
                    unit_amount: product.productId.subPrice * 100
                },
                quantity: product.quantity
            })),
            discounts: []

        })

        return { url: session.url }

    }

    // =====================webhook============
    async webhookService(data: any) {
        console.log(data);

        const orderId = data.data.object.metadata.orderId
        const order = await this._orderRepository.findOneAndUpdate({ _id: orderId }, {
            status: OrderStatusTypes.paid,
            orderChanges: {
                paidAt: new Date()
            },
            paymentIntent: data.data.object.payment_intent
        })
        return { order }
    }

    // ================= cancel order====================
    async cancelOrder(user: UserDocument, orderId: string) {
        console.log("ssssssssss");

        const order = await this._orderRepository.findOneAndUpdate({
            _id: orderId,
            status: { $in: [OrderStatusTypes.pending, OrderStatusTypes.paid, OrderStatusTypes.placed] }
        }, {
            status: OrderStatusTypes.cancelled,
            orderChanges: {
                cancelledAt: new Date(),
                cancelledBy: user._id
            }
        })

        if (order?.paymentMethod == PaymentMethodTypes.card) {
            await this.PaymentService.refund(order.paymentIntent, "requested_by_customer")
            return await this._orderRepository.findOneAndUpdate({ _id: orderId }, {
                status: OrderStatusTypes.refunded,
                orderChanges: {
                    refundedAt: new Date(),
                    refundedBy: user._id
                }
            })
        }

        return { order }

    }

    // ============get all orders=========
    async getAllOrders() {
        return await this._orderRepository.find({ filter: {}, populate: [{ path: "cartId" }] }) //[{}]
    }
}
