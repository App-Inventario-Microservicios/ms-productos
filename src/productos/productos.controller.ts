import { Controller } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

 
  @MessagePattern({cmd:'createProducto'})
  create(@Payload() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  
  @MessagePattern({cmd:'findAllProductos'})
  findAll(@Payload() PaginationDto: PaginationDto) {
    return this.productosService.findAll(PaginationDto);
  }


  @MessagePattern({cmd:'findOneProducto'})
  findOne(@Payload('id') id: string) {
    return this.productosService.findOne(+id);
  }


  @MessagePattern({cmd:'updateProducto'})
  update(@Payload() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(updateProductoDto.id, updateProductoDto);
  }

  @MessagePattern({cmd:'removeProducto'})
  remove(@Payload('id') id: string) {
    return this.productosService.remove(+id);
  }
}
