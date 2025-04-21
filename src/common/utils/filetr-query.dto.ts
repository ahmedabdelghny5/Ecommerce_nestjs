import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator"




export class QueryFilterDto {


    @IsOptional()
    @IsString()
    select: string
    
    @IsOptional()
    @IsString()
    sort: string

    @Type(() => Number)
    @IsPositive()
    @IsOptional()
    @IsNumber()
    page: number

}