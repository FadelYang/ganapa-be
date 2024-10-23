import { UserRole } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    name: string

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole
}