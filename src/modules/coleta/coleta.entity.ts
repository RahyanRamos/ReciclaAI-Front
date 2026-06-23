import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Solicitacao } from '../solicitacao/solicitacao.entity';
import { ColetaMaterial } from './coleta-material.entity';

export enum StatusColeta {
  PENDENTE = 'PENDENTE',
  EM_ROTA = 'EM_ROTA',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

@Entity('coletas')
export class Coleta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  dataColeta!: string;

  @Column({ type: 'enum', enum: StatusColeta, default: StatusColeta.PENDENTE })
  status!: StatusColeta;

  @Column({ type: 'text', nullable: true })
  observacao?: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;

  @UpdateDateColumn({ name: 'atualizado_em', nullable: true })
  atualizadoEm!: Date;

  @ManyToOne(() => Solicitacao, { nullable: true })
  @JoinColumn({ name: 'solicitacao_id' })
  solicitacao?: Solicitacao;

  @OneToMany(() => ColetaMaterial, (item) => item.coleta, { cascade: true })
  materiais!: ColetaMaterial[];

  get pesoTotalEstimado(): number {
    return (this.materiais ?? []).reduce(
      (total, item) => total + Number(item.quantidadeEstimada),
      0,
    );
  }
}
