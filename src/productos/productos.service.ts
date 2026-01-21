import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger('ProductosService');

  constructor(
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
  ) {}

  create(createProductoDto: CreateProductoDto) {
    const producto = this.productoRepo.create(createProductoDto);
    return this.productoRepo.save(producto);
  }

  async findAll(PaginationDto: PaginationDto) {
    const { pagina = 1, limite = 10, buscar = '' } = PaginationDto;

    const queryBuilder = this.productoRepo
      .createQueryBuilder('producto')
      .where('producto.disponible = :disponible', { disponible: true });

    if (buscar) {
      queryBuilder.andWhere('producto.nombre ILIKE :buscar', {
        buscar: `%${buscar}%`,
      });
    }

    queryBuilder
      .orderBy('producto.id', 'ASC')
      .skip((pagina - 1) * limite)
      .take(limite);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        pagina,
        ultimaPagina: Math.ceil(total / limite),
      },
    };
  }

  async findOne(id: number) {
    const producto = await this.productoRepo.findOneBy({
      id,
      disponible: true,
    });

    if (!producto) {
      throw new RpcException({
        message: `Producto con id # ${id} no encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    await this.findOne(id);

    const data = Object.fromEntries(
      Object.entries(updateProductoDto).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    if (Object.keys(data).length === 0) {
      throw new RpcException({
        message: 'No se proporcionaron datos para actualizar el producto.',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    await this.productoRepo.update(id, data);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.productoRepo.update(id, { disponible: false });
  }
}
