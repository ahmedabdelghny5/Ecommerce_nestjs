import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartRepository, OrderRepository } from 'src/DB/Repository';
import { CartModel, OrderModel } from 'src/DB/models';
import { PaymentService } from './service/payment';

@Module({
  imports: [OrderModel, CartModel],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, CartRepository,PaymentService],
  exports:[OrderService, OrderRepository, CartRepository,PaymentService]
})
export class OrderModule { }
