import { Injectable, NotFoundException } from "@nestjs/common"
import { CartItem, Order } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import { PrismaService } from "src/core/services/prisma.service"
import { OrderStatus } from '@prisma/client'
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto"
import { paginate, paginateOutput, PaginateOutput } from "src/common/utils/pagination.utils"

interface CartItemWithProduct extends CartItem {
    product: {
        id: number
        name: string
        price: Decimal
        stock: number
    }
}

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

    async createOrder(userId: number): Promise<Order> {
        const cartItems: CartItemWithProduct[] = await this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true }
        })

        if (!cartItems.length) {
            throw new NotFoundException('Tidak ada item di dalam kerangjang')
        }

        const totalAmount = cartItems.reduce((total, item) => {
            return total + item.product.price.toNumber() * item.quantity
        }, 0)

        const order = await this.prisma.order.create({
            data: {
                totalAmount,
                status: OrderStatus.PROCESSING,
                userId,
                orderItems: {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        qunatity: item.quantity
                    }))
                }
            },
            include: { orderItems: true }
        })

        await this.prisma.cartItem.deleteMany({
            where: { userId }
        })

        return order
    }

    async getAllOrders(query?: QueryPaginationDto): Promise<PaginateOutput<Order>> {
        const { search } = query

        const where: any = search
            ? {
                OR: [
                    { status: { contains: search, mode: 'insensitive' } },
                    { user: { name: { contains: search, mode: 'insensitive' } } }
                ],
            }
            : {}

        const [orders, total] = await Promise.all([
            await this.prisma.order.findMany({
                ...paginate(query),
                where,
                include: {
                    user: true,
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            }),
            await this.prisma.order.count({
                where
            })
        ])

        return paginateOutput<Order>(orders, total, query);
    }
}