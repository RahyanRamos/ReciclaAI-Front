import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Material } from '../material/material.entity';
import { Coleta } from './coleta.entity';

@Entity('coleta_materiais')
export class ColetaMaterial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number): number => value,
      from: (value: string): number => Number(value),
    },
  })
  quantidadeEstimada!: number;

  @ManyToOne(() => Coleta, (coleta) => coleta.materiais, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'coleta_id' })
  coleta!: Coleta;

  @ManyToOne(() => Material, { eager: true })
  @JoinColumn({ name: 'material_id' })
  material!: Material;
}
