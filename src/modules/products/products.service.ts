import { PrismaService } from "src/core/services/prisma.service";
import { CreateProductDto } from "./dtos/create-product.dto";
import { Product } from "@prisma/client";
import { ConflictException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto";
import { paginate, paginateOutput, PaginateOutput } from "src/common/utils/pagination.utils";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async createProduct(createProductDto: CreateProductDto, imagePath?: string): Promise<Product> {
        const { productCategoryId, image, ...rest } = createProductDto
        
        try {
            const newProduct = await this.prisma.product.create({
                data: {
                    ...rest,
                    image: imagePath || image,
                    productCategory: {
                        connect: {
                            id: createProductDto.productCategoryId
                        }
                    }
                }
            })

            return newProduct
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Product already exists')
            }

            if (error.code === 'P2003') {
                throw new NotFoundException('Product category not found')
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Product category not found')
            }

            throw new HttpException(error, 500)
        }
    }

    async getAllProducts(query?: QueryPaginationDto): Promise<PaginateOutput<Product>> {
        const [products, total] = await Promise.all([
            await this.prisma.product.findMany({
                ...paginate(query)
            }),
            await this.prisma.product.count()
        ])
        
        return paginateOutput<Product>(products, total, query)
    }

    async getProductById(id: number): Promise<Product> {
        try {
            const product = await this.prisma.product.findUniqueOrThrow({
                where: { id }
            })

            return product
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`product with id ${id} not found`)
            }

            throw new HttpException(error, 50)
        }
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {        
        try {
            await this.prisma.product.findUniqueOrThrow({
                where: { id }
            })

            const updatedProduct = await this.prisma.product.update({
                where: { id },
                data: {
                    ...updateProductDto
                }
            })

            return updatedProduct
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Product with id ${id} not found`)
            }

            if (error.code === 'P2002') {
                throw new ConflictException(`Product already exists`)
            }

            if (error.code === 'P2003') {
                throw new NotFoundException('Product category not found')
            }

            throw new HttpException(error, 500)
        }
    }

    async deleteProduct(id: number): Promise<string> {
        try {
            const product = await this.prisma.product.findUniqueOrThrow({
                where: { id }
            })

            await this.prisma.product.delete({
                where: { id }
            })

            return `Product with id ${product.id} deleted`
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Product with id ${id} not found`);
            }

            throw new HttpException(error, 500)
        }
    }
}