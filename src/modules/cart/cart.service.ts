import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/cart.dto';
import { UserDocument } from 'src/DB/models';
import { CartRepository, ProductRepository } from 'src/DB/Repository';

@Injectable()
export class CartService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly cartRepository: CartRepository
    ) { }

    // ====================== add to cart===================
    async createCart(body: CreateCartDto, user: UserDocument) {
        const { productId, quantity } = body;

        const product = await this.productRepository.findOne({ _id: productId, stock: { $gte: quantity } });
        if (!product) {
            throw new BadRequestException('Product not found or out of stock');
        }

        const cart = await this.cartRepository.findOne({ userId: user._id })
        if (!cart) {
            return await this.cartRepository.create({
                userId: user._id,
                products: [{
                    productId: product._id,
                    quantity,
                    finalPrice: product.subPrice
                }]
            })
        }
        const productExist = cart.products.find((p) => {
            return p.productId.toString() == productId.toString()
        })
        if (productExist) {
            throw new BadRequestException("Product already exists in cart");
        }

        cart.products.push({
            productId: product._id,
            quantity,
            finalPrice: product.subPrice
        })
        return await cart.save();
    }

    // ===================remove from  cart==============
    async removeFromCart(productId: string, user: UserDocument) {
        const cart = await this.cartRepository.findOne({ userId: user._id, "products.productId": productId })
        if (!cart) {
            throw new BadRequestException('Product not found in cart');
        }

        cart.products = cart.products.filter((p) => {
            return p.productId.toString() !== productId.toString()
        })
        return await cart.save();
    }

    // ===================update quantity==================
    async updateQuantity(body: CreateCartDto, user: UserDocument) {
        const { productId, quantity } = body;

        const productExist = await this.productRepository.findOne({ _id: productId, stock: { $gte: quantity } });
        if (!productExist) {
            throw new BadRequestException('Product not found or out of stock');
        }

        const cart = await this.cartRepository.findOne({ userId: user._id, "products.productId": productId })
        if (!cart) {
            throw new BadRequestException('Product not found in cart');
        }

        const product = cart.products.find((p) => {
            return p.productId.toString() == productId.toString()
        })
        if (!product) {
            throw new BadRequestException('Product not found in cart');
        }
        product.quantity = quantity
        return await cart.save();
    }

}
