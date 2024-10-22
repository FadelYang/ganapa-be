import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/services/prisma.service";
import { AddItemToCartDto } from "./dto/add-item-to-cart.dto";
import { CartItem } from "@prisma/client";

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async addItemToCart(addItemToCartDto: AddItemToCartDto): Promise<CartItem> {
        try {
            const existingCartItem = await this.prisma.cartItem.findUnique({
                where: {
                    userId_productId: {
                        userId: addItemToCartDto.userId,
                        productId: addItemToCartDto.productId,
                    }
                }
            })
            console.log(existingCartItem);
            
            if (existingCartItem) {
                return await this.prisma.cartItem.update({
                    where: { id: existingCartItem.id },
                    data: {
                        quantity: existingCartItem.quantity + addItemToCartDto.quantity
                    }
                })
            } else {
                return await this.prisma.cartItem.create({
                    data: {
                        ...addItemToCartDto
                    }
                })
            }
        } catch (error) {
            if (error.code === 'P2003') {
                throw new NotFoundException('Product not found')
            }

        }
    }

    async getUserCart(userId: number): Promise<CartItem[]> {
        try {
            return await this.prisma.cartItem.findMany({
                where: { userId },
                include: {
                    product: true
                }
            })
        } catch (error) {
            throw new HttpException('Unable to retrieve cart', 500)
        }
    }
}