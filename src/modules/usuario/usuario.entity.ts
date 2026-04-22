import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TipoPessoa {
  PF = 'PF',
  PJ = 'PJ',
}

export enum PerfilUsuario {
  CLIENTE = 'CLIENTE',
  CATADOR = 'CATADOR',
  EMPRESA = 'EMPRESA',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 140 })
  nome!: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  email!: string;

  @Column({ type: 'enum', enum: TipoPessoa, default: TipoPessoa.PF })
  tipoPessoa!: TipoPessoa;

  @Column({ type: 'enum', enum: PerfilUsuario, default: PerfilUsuario.CLIENTE })
  perfil!: PerfilUsuario;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;

  @UpdateDateColumn({ name: 'atualizado_em', nullable: true })
  atualizadoEm!: Date;
}
