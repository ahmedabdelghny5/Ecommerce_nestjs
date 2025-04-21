import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel, ProductModel } from 'src/DB/models';
import { ProductModule } from '../product/product.module';
import { CartRepository, ProductRepository } from 'src/DB/Repository';

@Module({
  imports: [CartModel, ProductModel],
  controllers: [CartController],
  providers: [CartService, ProductRepository, CartRepository]
})
export class CartModule { }
