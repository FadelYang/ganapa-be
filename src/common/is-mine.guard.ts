import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/services/prisma.service";

@Injectable()
export class IsMineGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        const route = request.route.path.split('/')[1];
        const paramId = isNaN(parseInt(request.params.id)) ? 0 : parseInt(request.params.id)

        if (paramId === request.user.id) {
            console.log('Access Granted');
            return true;
          }
        
          console.log('Forbidden Access');
          return false;
    }
}