import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  precio: number;
  @Column({ type: 'boolean', default: true })
  disponible: boolean;
  @Column({ type: 'int', default: 1 })
  stock: number;
}
