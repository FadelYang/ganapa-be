import { Module } from "@nestjs/common";
import { ProductService } from "./products.service";
import { ProductController } from "./products.controller";

@Module({
    imports: [],
    controllers: [ProductController],
    providers: [ProductService]
})
export class ProductModule { }