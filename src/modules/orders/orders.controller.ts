import { Controller, Param, Post, Request, UseGuards } from "@nestjs/common";
import { OrderService } from "./orders.service";
import { IsMineGuard } from "src/common/is-mine.guard";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";
import { UserPayload } from "../users/interfaces/users-login-interface";

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post()
    async createUser(@Request() req: ExpressRequestWithUser) {
        const userId = +req.user.sub
        return this.orderService.createOrder(+userId)
    }
}