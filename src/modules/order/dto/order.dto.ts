import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PaymentMethodTypes } from "src/common/types/types";


export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    phone: string;
    @IsString()
    @IsNotEmpty()
    address: string;
    @IsEnum(PaymentMethodTypes)
    @IsNotEmpty()
    paymentMethod: string;

}