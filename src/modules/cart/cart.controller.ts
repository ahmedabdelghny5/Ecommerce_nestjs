import { Body, Controller, Delete, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth, UserDecorator } from 'src/common/decorator';
import { UserRoles } from 'src/common/types/types';
import { UserDocument } from 'src/DB/models';
import { CreateCartDto } from './dto/cart.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {

    constructor(
        private readonly _cartService: CartService,
    ) { }
    // ================== add to cart ===================
    @Post()
    @Auth(UserRoles.admin, UserRoles.user)
    @UsePipes(new ValidationPipe())
    async createCart(@Body() body: CreateCartDto, @UserDecorator() user: UserDocument) {
        return await this._cartService.createCart(body, user);
    }

    // ================remove from cart============
    @Delete()
    @Auth(UserRoles.admin, UserRoles.user)
    async removeFromCart(@Body("productId") productId: string, @UserDecorator() user: UserDocument) {
        return await this._cartService.removeFromCart(productId, user);
    }

    // ================update quantity============
    @Put()
    @Auth(UserRoles.admin, UserRoles.user)
    async updateQuantity(@Body() body: CreateCartDto, @UserDecorator() user: UserDocument) {
        return await this._cartService.updateQuantity(body, user);
    }

}
