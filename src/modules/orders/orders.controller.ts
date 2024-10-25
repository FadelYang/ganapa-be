import { Controller, Get, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { OrderService } from "./orders.service";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";
import { Order, UserRole } from "@prisma/client";
import { Roles } from "src/common/decorators/roles-decorator";
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto";
import { PaginateOutput } from "src/common/utils/pagination.utils";

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post()
    async createUser(@Request() req: ExpressRequestWithUser) {
        const userId = +req.user.sub
        return this.orderService.createOrder(+userId)
    }

    @Get()
    @Roles(UserRole.ADMIN)
    getAllOrders(
        @Query() query?: QueryPaginationDto
    ): Promise<PaginateOutput<Order>> {
        return this.orderService.getAllOrders(query)
    }
}