
import { Module } from "@nestjs/common";
import { OrderResolver } from "./resolver/order.resolver.js";
import { OrderModule } from "../modules/index";



@Module({
    imports: [
        OrderModule
    ],
    providers: [
        OrderResolver
    ]
})
export class GqlConfig { }