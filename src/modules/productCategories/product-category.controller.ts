import { Body, Controller, Post, Request } from "@nestjs/common";
import { ProductCategoryService } from "./product-category.service";
import { CreateProductCategoryDto } from "./dtos/create-product-category.dto";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";
import { ProductCategory } from "@prisma/client";

@Controller('product-categories')
export class ProductCategoryController {
    constructor(private readonly productCategoryService: ProductCategoryService) { }

    @Post()
    async createPost(
        @Body() createProductCategoryDto: CreateProductCategoryDto,
    ): Promise <ProductCategory> {
        return this.productCategoryService.createProductCategory(createProductCategoryDto)
    }
}