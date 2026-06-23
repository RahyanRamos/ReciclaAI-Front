import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SolicitacaoMaterial } from './solicitacao-material.entity';

export enum StatusSolicitacao {
  ABERTA = 'ABERTA',
  AGENDADA = 'AGENDADA',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

@Entity('solicitacoes_coleta')
export class Solicitacao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  descricao!: string;

  @Column({ type: 'varchar', length: 150 })
  localizacao!: string;

  @Column({
    type: 'enum',
    enum: StatusSolicitacao,
    default: StatusSolicitacao.ABERTA,
  })
  status!: StatusSolicitacao;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;

  @UpdateDateColumn({ name: 'atualizado_em', nullable: true })
  atualizadoEm!: Date;

  @OneToMany(() => SolicitacaoMaterial, (item) => item.solicitacao, {
    cascade: true,
  })
  materiais!: SolicitacaoMaterial[];

  get volumeEstimadoTotal(): number {
    return (this.materiais ?? []).reduce(
      (total, item) => total + Number(item.quantidadeEstimada),
      0,
    );
  }
}
