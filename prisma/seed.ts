import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const categories = await prisma.productCategory.createMany({
        data: [
            { name: 'Clothing' },
            { name: 'Electronic' },
        ],
        skipDuplicates: true
    })

    console.log('Categories seeded:', categories)

    const clothingCategory = await prisma.productCategory.findUnique({
        where: { name: 'Clothing' }
    })

    const ElectronicCategory = await prisma.productCategory.findUnique({
        where: { name: 'Electronic' }
    })

    const products = await prisma.product.createMany({
        data: [
            {
                name: 'Laptop',
                description: 'Low budget and high quality laptop',
                price: 1500000,
                stock: 100,
                image: 'https://placehold.co/600x400/png',
                productCategoryId: ElectronicCategory?.id
            },
            {
                name: 'Kaos Polos',
                description: 'Kaos polos nyaman dan aman',
                price: 150000,
                stock: 100,
                image: 'https://placehold.co/600x400/png',
                productCategoryId: clothingCategory?.id
            }
        ],
        skipDuplicates: true,
    })

    console.log('Products seeded:', products)

    const users = await prisma.user.createMany({
        data: [
            {
                email: 'admin@example.com',
                password: 'adminpassword',
                role: 'ADMIN',
            },
            {
                email: 'user@example.com',
                password: 'userpassword',
                role: 'USER',
            },
        ],
        skipDuplicates: true,
    })

    console.log('Users seeded:', users)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })