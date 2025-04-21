import { Injectable } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class PaymentService {
    constructor() { }


    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    async createSession({
        customer_email,
        metadata,
        line_items,
        discounts
    }) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email,
            metadata,
            success_url: "http://localhost:3000/order/success",
            cancel_url: "http://localhost:3000/order/failure",
            line_items,
            discounts
        })

        return session
    }


    async refund(payment_intent, reason) {
        return await this.stripe.refunds.create({
            payment_intent,
            reason
        })

    }

}

