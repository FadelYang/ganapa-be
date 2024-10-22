import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ProductService } from "./products.service";
import { CreateProductDto } from "./dtos/create-product.dto";
import { Product } from "@prisma/client";
import { Public } from "src/common/decorators/public.decorator";
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto";
import { PaginateOutput } from "src/common/utils/pagination.utils";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    async createProduct(
        @Body() createProductDto: CreateProductDto
    ): Promise<Product> {
        return this.productService.createProduct(createProductDto)
    }

    @Public()
    @Get()
    getAllProducts(
        @Query() query?: QueryPaginationDto
    ): Promise<PaginateOutput<Product>> {
        return this.productService.getAllProducts(query)
    }

    @Public()
    @Get(':id')
    getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return this.productService.getProductById(id)
    }

    @Patch(':id')
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto
    ): Promise<Product> {
        return this.productService.updateProduct(+id, updateProductDto)
    }

    @Delete(":id")
    async deletePost(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return this.productService.deleteProduct(+id)
    }
}