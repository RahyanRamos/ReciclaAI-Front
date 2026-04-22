import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('avaliacoes')
export class Avaliacao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'tinyint' })
  nota!: number;

  @Column({ type: 'varchar', length: 250, nullable: true })
  comentario?: string;

  @Column({ type: 'date' })
  dataAvaliacao!: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;

  @UpdateDateColumn({ name: 'atualizado_em', nullable: true })
  atualizadoEm!: Date;
}
