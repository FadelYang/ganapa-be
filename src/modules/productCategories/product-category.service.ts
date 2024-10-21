import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/services/prisma.service";
import { CreateProductCategoryDto } from "./dtos/create-product-category.dto";
import { ProductCategory } from "@prisma/client";

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
                throw new ConflictException('Category already exists')
            }
        }
    }
}