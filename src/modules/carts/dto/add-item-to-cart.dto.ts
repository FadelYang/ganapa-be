import { IsInt, IsNotEmpty, Min } from "class-validator"

export class AddItemToCartDto {
    userId: number

    @IsNotEmpty()
    productId: number

    @IsInt()
    @Min(1)
    quantity: number
}