import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { UserRole } from "@prisma/client";
import { ROLES_KEY } from "./decorators/roles-decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const token = request.headers.authorization.split(' ')[1]
        const user = await this.jwtService.verifyAsync(token)

        return requiredRoles.includes(user.role)
    }
}