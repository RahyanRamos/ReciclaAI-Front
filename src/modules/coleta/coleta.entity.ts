import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number): number => value,
      from: (value: string): number => Number(value),
    },
    default: 0,
  })
  pesoTotal!: number;

  @Column({ type: 'enum', enum: StatusColeta, default: StatusColeta.PENDENTE })
  status!: StatusColeta;

  @Column({ type: 'text', nullable: true })
  observacao?: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;

  @UpdateDateColumn({ name: 'atualizado_em', nullable: true })
  atualizadoEm!: Date;
}
