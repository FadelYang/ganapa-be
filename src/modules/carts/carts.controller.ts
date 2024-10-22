import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Request, UseGuards } from "@nestjs/common";
import { AddItemToCartDto } from "./dto/add-item-to-cart.dto";
import { CartService } from "./carts.service";
import { CartItem } from "@prisma/client";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";
import { IsMineGuard } from "src/common/is-mine.guard";

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

    @Get()
    getUserCart(
        @Request() req: ExpressRequestWithUser
    ): Promise<CartItem[]> {
        const userId = +req.user.sub
        return this.cartService.getUserCart(+userId)
    }

    @Delete(':id')
    @UseGuards(IsMineGuard)
    deleteCartItem(
        @Param('id', ParseIntPipe) cartItemId: number,
    ): Promise<string> {
        return this.cartService.deleteCartItem(cartItemId)
    }
}