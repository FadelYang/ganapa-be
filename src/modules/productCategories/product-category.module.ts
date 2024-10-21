import { Controller, Module } from "@nestjs/common";
import { ProductCategoryController } from "./product-category.controller";
import { ProductCategoryService } from "./product-category.service";

@Module({
    imports: [],
    controllers: [ProductCategoryController],
    providers: [ProductCategoryService]
})
export class ProductCategoryModule { }