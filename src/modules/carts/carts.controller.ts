import { Body, Controller, Post, Request } from "@nestjs/common";
import { AddItemToCartDto } from "./dto/add-item-to-cart.dto";
import { CartService } from "./carts.service";
import { CartItem } from "@prisma/client";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";

@Controller('carts')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    addItemToCart(
        @Body() addItemToCartDto: AddItemToCartDto,
        @Request() req: ExpressRequestWithUser
    ): Promise<CartItem> {
        addItemToCartDto.userId = req.user.sub
        return this.cartService.addItemToCart(addItemToCartDto)
    }
}