import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  volumeEstimado!: number;

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
}
