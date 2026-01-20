import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    @IsPositive()
    @IsOptional()
    @Type(() => Number)

    pagina?: number = 1;

    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limite?: number = 10;

}
