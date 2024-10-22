import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/services/prisma.service";

@Injectable()
export class IsMineGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        const route = request.route.path.split('/')[1];
        const paramId = isNaN(parseInt(request.params.id)) ? 0 : parseInt(request.params.id)

        switch (route) {
            case 'carts':
                const cartItem = await this.prismaService.cartItem.findUnique({
                    where: { id: paramId },
                });

                console.log('CartItem' + cartItem);
                

                // Check if the cartItem exists and if it belongs to the current user
                if (!cartItem || cartItem.userId !== request.user.sub) {
                    throw new HttpException('Unauthorized access to cart', 403);
                }
                return true;

            default:
                return paramId === request.user.id;
        }
    }
}