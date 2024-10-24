import { IsNumberString, IsOptional, IsString } from "class-validator"

export class QueryPaginationDto {
    @IsOptional()
    @IsNumberString()
    page?: string

    @IsOptional()
    @IsNumberString()
    size?: string

    @IsOptional()
    @IsString()
    search?: string
}