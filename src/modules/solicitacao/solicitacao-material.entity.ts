import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Material } from '../material/material.entity';
import { Solicitacao } from './solicitacao.entity';

@Entity('solicitacao_materiais')
export class SolicitacaoMaterial {
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

  @ManyToOne(() => Solicitacao, (solicitacao) => solicitacao.materiais, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'solicitacao_id' })
  solicitacao!: Solicitacao;

  @ManyToOne(() => Material, { eager: true })
  @JoinColumn({ name: 'material_id' })
  material!: Material;
}
