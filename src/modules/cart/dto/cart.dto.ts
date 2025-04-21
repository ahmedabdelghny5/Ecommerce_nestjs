import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";


export class CreateCartDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @Type(() => Number)
    @IsPositive()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}