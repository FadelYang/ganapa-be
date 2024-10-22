import { IsNotEmpty, IsNumber } from "class-validator"

export class AddItemToCartDto {
    userId: number

    @IsNotEmpty()
    productId: number

    @IsNumber()
    quantity: number
}