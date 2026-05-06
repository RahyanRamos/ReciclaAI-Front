import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATABASE_SOURCE } from '../../config/constants/database-source';
import { PerfilUsuario, TipoPessoa, Usuario } from './usuario.entity';

type ResultadoListaUsuarios = {
  registros: Usuario[];
  bancoIndisponivel: boolean;
  tabelaInexistente: boolean;
};

type MysqlError = {
  code?: unknown;
};

type UsuarioFormData = {
  nome?: string;
  email?: string;
  tipoPessoa?: TipoPessoa;
  perfil?: PerfilUsuario;
  ativo?: string | boolean;
};

const toBoolean = (value: string | boolean | undefined): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  return ['true', '1', 'on', 'sim'].includes(String(value).toLowerCase());
};

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(DATABASE_SOURCE) private readonly dataSource: DataSource,
  ) {}

  private repository(): Repository<Usuario> {
    return this.dataSource.getRepository(Usuario);
  }

  private toEntityData(dados: UsuarioFormData): Partial<Usuario> {
    return {
      nome: dados.nome?.trim() ?? '',
      email: dados.email?.trim() ?? '',
      tipoPessoa: dados.tipoPessoa ?? TipoPessoa.PF,
      perfil: dados.perfil ?? PerfilUsuario.CLIENTE,
      ativo: toBoolean(dados.ativo),
    };
  }

  async listar(): Promise<ResultadoListaUsuarios> {
    if (!this.dataSource.isInitialized) {
      return {
        registros: [],
        bancoIndisponivel: true,
        tabelaInexistente: false,
      };
    }

    try {
      const registros = await this.repository().find({
        order: { id: 'ASC' },
      });

      return {
        registros,
        bancoIndisponivel: false,
        tabelaInexistente: false,
      };
    } catch (error) {
      const mysqlError = error as MysqlError;

      if (mysqlError.code === 'ER_NO_SUCH_TABLE') {
        return {
          registros: [],
          bancoIndisponivel: false,
          tabelaInexistente: true,
        };
      }

      throw error;
    }
  }

  async findOne(id: number): Promise<Usuario | null> {
    if (!this.dataSource.isInitialized) {
      return null;
    }

    return this.repository().findOne({ where: { id } });
  }

  async create(dados: UsuarioFormData): Promise<Usuario> {
    const usuario = this.repository().create(this.toEntityData(dados));

    return this.repository().save(usuario);
  }

  async update(id: number, dados: UsuarioFormData): Promise<Usuario | null> {
    const usuario = await this.findOne(id);

    if (!usuario) {
      return null;
    }

    Object.assign(usuario, this.toEntityData(dados));

    return this.repository().save(usuario);
  }

  async remove(id: number): Promise<Usuario | null> {
    const usuario = await this.findOne(id);

    if (!usuario) {
      return null;
    }

    return this.repository().remove(usuario);
  }
}
