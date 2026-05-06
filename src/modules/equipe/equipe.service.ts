import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATABASE_SOURCE } from '../../config/constants/database-source';
import { Equipe } from './equipe.entity';

type ResultadoListaEquipes = {
  registros: Equipe[];
  bancoIndisponivel: boolean;
  tabelaInexistente: boolean;
};

type MysqlError = {
  code?: unknown;
};

type EquipeFormData = {
  nome?: string;
  empresaResponsavel?: string;
  ativo?: string | boolean;
};

const toBoolean = (value: string | boolean | undefined): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  return ['true', '1', 'on', 'sim'].includes(String(value).toLowerCase());
};

@Injectable()
export class EquipeService {
  constructor(
    @Inject(DATABASE_SOURCE) private readonly dataSource: DataSource,
  ) {}

  private repository(): Repository<Equipe> {
    return this.dataSource.getRepository(Equipe);
  }

  private toEntityData(dados: EquipeFormData): Partial<Equipe> {
    return {
      nome: dados.nome?.trim() ?? '',
      empresaResponsavel: dados.empresaResponsavel?.trim() ?? '',
      ativo: toBoolean(dados.ativo),
    };
  }

  async listar(): Promise<ResultadoListaEquipes> {
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

  async findOne(id: number): Promise<Equipe | null> {
    if (!this.dataSource.isInitialized) {
      return null;
    }

    return this.repository().findOne({ where: { id } });
  }

  async create(dados: EquipeFormData): Promise<Equipe> {
    const equipe = this.repository().create(this.toEntityData(dados));

    return this.repository().save(equipe);
  }

  async update(id: number, dados: EquipeFormData): Promise<Equipe | null> {
    const equipe = await this.findOne(id);

    if (!equipe) {
      return null;
    }

    Object.assign(equipe, this.toEntityData(dados));

    return this.repository().save(equipe);
  }

  async remove(id: number): Promise<Equipe | null> {
    const equipe = await this.findOne(id);

    if (!equipe) {
      return null;
    }

    return this.repository().remove(equipe);
  }
}
