import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    price: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    stock: number

    @IsNotEmpty()
    @Type(() => Number)
    productCategoryId: number

    @IsOptional()
    image: any
}