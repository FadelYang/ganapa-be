import { ConflictException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/services/prisma.service";
import { CreateProductCategoryDto } from "./dtos/create-product-category.dto";
import { ProductCategory } from "@prisma/client";
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto";
import { paginate, paginateOutput, PaginateOutput } from "src/common/utils/pagination.utils";
import { UpdateProductCategoryDto } from "./dtos/update-product-category.dto";

@Injectable()
export class ProductCategoryService {
    constructor(private prisma: PrismaService) { }

    async createProductCategory(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
        try {
            const newProductCategory = await this.prisma.productCategory.create({
                data: {
                    ...createProductCategoryDto
                }
            })

            return newProductCategory
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Product category already exists')
            }
        }
    }

    async getAllProductCategory(query?: QueryPaginationDto): Promise<PaginateOutput<ProductCategory>> {
        const [productCategories, total] = await Promise.all([
            await this.prisma.productCategory.findMany({
                ...paginate(query)
            }),
            await this.prisma.productCategory.count()
        ])

        return paginateOutput<ProductCategory>(productCategories, total, query)
    }

    async getProductCategoryById(id: number): Promise<ProductCategory> {
        try {
            const productCategory = await this.prisma.productCategory.findUniqueOrThrow({
                where: { id }
            })

            return productCategory
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Product category with id ${id} not found`)
            }

            throw new HttpException(error, 500)
        }
    }

    async updateProductCategory(id: number, updateProductCateogryDto: UpdateProductCategoryDto): Promise<ProductCategory> {
        try {
            await this.prisma.productCategory.findUniqueOrThrow({
                where: { id }
            })

            const updateProductCateogry = await this.prisma.productCategory.update({
                where: { id },
                data: {
                    ...updateProductCateogryDto
                }
            })

            return updateProductCateogry
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Product category with id ${id} not found`)
            }

            if (error.code === 'P2002') {
                throw new ConflictException('Product category already exists')
            }
        }
    }

    async deleteProductCategory(id: number): Promise<string> {
        try {
            const productCategory = await this.prisma.productCategory.findUniqueOrThrow({
                where: { id }
            })

            await this.prisma.productCategory.delete({
                where: { id }
            })

            return `Product category with id ${productCategory.id} deleted`
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Product category with id ${id} not found`)
            }
        }
    }
}