import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, Validate, IsNumberString } from "class-validator";
import { Types } from "mongoose";
import { QueryFilterDto } from "src/common/utils/filetr-query.dto";


export class CreateProductDto {
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    category: string;

    // @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    subCategory: string;

    // @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    brand: string

    @IsNotEmpty()
    mainImage: object;


    @IsOptional()
    @IsArray()
    subImages: object[];

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    quantity: number;


}




export class updateProductDto {
    @IsString()
    @MinLength(2)
    @IsOptional()
    name: string;

    @IsString()
    @MinLength(2)
    @IsOptional()
    description: string;

    @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    category: string;

    //@IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    subCategory: string;

    //@IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value)
    })
    brand: string

    @IsOptional()
    mainImage: object;


    @IsOptional()
    @IsArray()
    subImages: object[];

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    price: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    discount: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    stock: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    quantity: number;


}



export class QueryDto extends QueryFilterDto {
    @IsOptional()
    @IsString()
    name?: string;


}
