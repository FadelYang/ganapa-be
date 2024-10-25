import { PrismaService } from "src/core/services/prisma.service"
import { CreateProductDto } from "./dtos/create-product.dto"
import { Product } from "@prisma/client"
import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from "@nestjs/common"
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto"
import { paginate, paginateOutput, PaginateOutput } from "src/common/utils/pagination.utils"
import { UpdateProductDto } from "./dtos/update-product.dto"
import { join } from "path"
import { writeFile, unlink } from "fs/promises"
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async createProduct(createProductDto: CreateProductDto, file: Express.Multer.File): Promise<Product> {
        const { productCategoryId, stock, price, ...rest } = createProductDto

        const allowedMimeTypes = /\/(jpg|jpeg|png|gif)$/
        if (!file.mimetype.match(allowedMimeTypes)) {
            throw new BadRequestException('Only image files are allowed!')
        }

        if (!file) {
            throw new BadRequestException('Image file is required!')
        }

        try {
            const uniqueFileName = `${uuidv4()}.png`

            const uploadPath = join(__dirname, '..', 'uploads', uniqueFileName)

            const newProduct = await this.prisma.product.create({
                data: {
                    ...rest,
                    stock: +stock,
                    price: +price,
                    image: uniqueFileName,
                    productCategory: {
                        connect: {
                            id: +productCategoryId,
                        },
                    },
                },
            })

            await writeFile(uploadPath, file.buffer)

            return newProduct
        } catch (error) {

            if (error.code === 'P2002') {
                throw new ConflictException('Product already exists')
            }

            if (error.code === 'P2003' || error.code === 'P2025') {
                throw new NotFoundException('Product category not found')
            }

            throw new HttpException(error, 500)
        }
    }


    async getAllProducts(query?: QueryPaginationDto): Promise<PaginateOutput<Product>> {
        const { search } = query

        const where: any = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}

        const [products, total] = await Promise.all([
            await this.prisma.product.findMany({
                ...paginate(query),
                where,
                include: {
                    productCategory: true
                }
            }),
            await this.prisma.product.count({
                where
            })
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

    async updateProduct(id: number, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<Product> {
        const { productCategoryId, stock, price, ...rest } = updateProductDto

        try {
            const existingProduct = await this.prisma.product.findUniqueOrThrow({
                where: { id }
            })

            if (file) {
                if (existingProduct.image) {
                    unlink(`./uploads/${existingProduct.image}`)
                }

                const allowedMimeTypes = /\/(jpg|jpeg|png|gif)$/
                if (!file.mimetype.match(allowedMimeTypes)) {
                    throw new BadRequestException('Only image files are allowed!')
                }
            }

            const uniqueFileName = `${uuidv4()}.png`

            const uploadPath = join(__dirname, '..', 'uploads', uniqueFileName)

            await this.prisma.product.findUniqueOrThrow({
                where: { id }
            })

            const updatedProduct = await this.prisma.product.update({
                where: { id },
                data: {
                    ...rest,
                    stock: +stock,
                    price: +price,
                    image: uniqueFileName,
                    productCategory: {
                        connect: {
                            id: +productCategoryId,
                        },
                    },
                },
            })

            if (file) {
                await writeFile(uploadPath, file.buffer)
            }

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
                throw new NotFoundException(`Product with id ${id} not found`)
            }

            throw new HttpException(error, 500)
        }
    }
}