import { Query, Resolver } from "@nestjs/graphql";
import { OrderService } from "../../modules/order/order.service";
import { OrderType } from './../types/order.type';
import { Auth } from "../../common/decorator/auth.decorator";
import { UserRoles } from "../../common/types/types";


@Resolver()
export class OrderResolver {


    constructor(
        private readonly OrderService:OrderService
    ){}

    @Auth(UserRoles.user)
    @Query(() => [OrderType], { name: "getAllOrders", description: "all orders" })
    async getAllOrders() {
        return await this.OrderService.getAllOrders()
    }
    @Query(() => Number, { name: "getNumber", description: "nubmer all" })
    async getNumber() {
        return 25
    }





}