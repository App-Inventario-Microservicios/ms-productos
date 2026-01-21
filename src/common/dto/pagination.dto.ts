import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  pagina?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limite?: number = 10;

  @IsOptional()
  @IsString()
  @Type(() => String)
  buscar?: string = '';
}
