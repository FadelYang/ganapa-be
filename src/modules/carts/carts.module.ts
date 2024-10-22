import { Module } from "@nestjs/common";
import { CartController } from "./carts.controller";
import { CartService } from "./carts.service";

@Module({
    imports: [],
    controllers: [CartController],
    providers: [CartService]
})
export class CartModule { }