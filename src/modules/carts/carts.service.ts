import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/services/prisma.service";
import { AddItemToCartDto } from "./dto/add-item-to-cart.dto";
import { CartItem } from "@prisma/client";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

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
    async updateCartItemQuantity(cartItemId: number, change: number): Promise<CartItem> {
        try {
            const cartItem = await this.prisma.cartItem.findUniqueOrThrow({
                where: { id: cartItemId }
            });
    
            const newItemQuantity = cartItem.quantity + change;
    
            if (newItemQuantity < 1) {
                throw new HttpException('Quantity cannot be less than 1', 400);
            }
    
            return await this.prisma.cartItem.update({
                where: { id: cartItemId },
                data: { quantity: newItemQuantity }
            });
        } catch (error) {
            if (error) {
                return error
            }
            throw new HttpException('Unable to update cart item quantity', 500);
        }
    }
    

    async deleteCartItem(cartItemId: number): Promise<string> {
        try {
            const cartItem = await this.prisma.cartItem.findFirstOrThrow({
                where: { id: cartItemId }
            })

            await this.prisma.cartItem.delete({
                where: { id: cartItemId }
            })

            return `Success delete cart item`
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Cart Item Not Found')
            }

            throw new HttpException('Unable to delete cart item', 500)
        }
    }
}