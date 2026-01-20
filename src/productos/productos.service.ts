import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common';



@Injectable()
export class ProductosService {
  private readonly logger = new Logger('ProductosService');
  
  constructor(@InjectRepository(Producto) private productoRepo: Repository<Producto>) {}

  create(createProductoDto: CreateProductoDto) {
    const producto = this.productoRepo.create(createProductoDto);
    return this.productoRepo.save(producto);
  }

  async findAll(PaginationDto: PaginationDto) {
    const{pagina=1,limite=10} = PaginationDto;
    const totalPaginas = await this.productoRepo.count({where:{disponible:true}});
    const ultimaPagina = Math.ceil(totalPaginas/limite);

    return {
      data: await this.productoRepo.find({   
        skip: (pagina - 1) * limite,
        take: limite,
        where:{disponible:true}
  }), 
    meta:{
      total: totalPaginas,
      pagina: pagina,
      ultimaPagina: ultimaPagina,
    }
  }}

  async findOne(id: number) {
    const producto = await this.productoRepo.findOneBy({id,disponible:true});

    if (!producto){
      throw new NotFoundException(`Producto con id # ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    
    await this.findOne(id);
    
    const data = Object.fromEntries(
      Object.entries(updateProductoDto).filter(([_, value]) => value !== undefined)
    );  

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No se proporcionaron datos para actualizar el producto.');
    }

    await this.productoRepo.update(id, data);

     return this.findOne(id);
    
  }

  async remove(id: number) {
    
    await this.findOne(id);

    return await this.productoRepo.update(id, {disponible:false});

    
  }
}
