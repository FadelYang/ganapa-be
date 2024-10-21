import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ProductCategoryService } from "./product-category.service";
import { CreateProductCategoryDto } from "./dtos/create-product-category.dto";
import { ProductCategory } from "@prisma/client";
import { Public } from "src/common/decorators/public.decorator";
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto";
import { PaginateOutput } from "src/common/utils/pagination.utils";
import { UpdateProductCategoryDto } from "./dtos/update-product-category.dto";

@Controller('product-categories')
export class ProductCategoryController {
    constructor(private readonly productCategoryService: ProductCategoryService) { }

    @Post()
    async createPost(
        @Body() createProductCategoryDto: CreateProductCategoryDto,
    ): Promise<ProductCategory> {
        return this.productCategoryService.createProductCategory(createProductCategoryDto)
    }

    @Public()
    @Get()
    getAllProductCategories(
        @Query() query?: QueryPaginationDto
    ): Promise<PaginateOutput<ProductCategory>> {
        return this.productCategoryService.getAllProductCategory(query)
    }

    @Public()
    @Get(':id')
    getPostById(@Param('id', ParseIntPipe) id: number): Promise<ProductCategory> {
        return this.productCategoryService.getProductCategoryById(id)
    }

    @Patch(':id')
    async updateProductCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductCategoryDto: UpdateProductCategoryDto
    ): Promise<ProductCategory> {
        return this.productCategoryService.updateProductCategory(+id, updateProductCategoryDto)
    }

    @Delete(':id')
    async deleteProductCategory(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return this.productCategoryService.deleteProductCategory(+id)
    }
}