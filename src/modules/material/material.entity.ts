import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('materiais')
export class Material {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 120 })
  nome!: string;

  @Column({ type: 'varchar', length: 80 })
  categoria!: string;

  @Column({ type: 'varchar', length: 30, default: 'kg' })
  unidadeMedida!: string;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;

  @UpdateDateColumn({ name: 'atualizado_em', nullable: true })
  atualizadoEm!: Date;
}
