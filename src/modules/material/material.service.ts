import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATABASE_SOURCE } from '../../config/constants/database-source';
import { Material } from './material.entity';

type ResultadoListaMateriais = {
  registros: Material[];
  bancoIndisponivel: boolean;
  tabelaInexistente: boolean;
};

type MysqlError = {
  code?: unknown;
};

type MaterialFormData = {
  nome?: string;
  categoria?: string;
  unidadeMedida?: string;
  ativo?: string | boolean;
};

const toBoolean = (value: string | boolean | undefined): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  return ['true', '1', 'on', 'sim'].includes(String(value).toLowerCase());
};

@Injectable()
export class MaterialService {
  constructor(
    @Inject(DATABASE_SOURCE) private readonly dataSource: DataSource,
  ) {}

  private repository(): Repository<Material> {
    return this.dataSource.getRepository(Material);
  }

  private toEntityData(dados: MaterialFormData): Partial<Material> {
    return {
      nome: dados.nome?.trim() ?? '',
      categoria: dados.categoria?.trim() ?? '',
      unidadeMedida: dados.unidadeMedida?.trim() || 'kg',
      ativo: toBoolean(dados.ativo),
    };
  }

  async listar(): Promise<ResultadoListaMateriais> {
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

  async findOne(id: number): Promise<Material | null> {
    if (!this.dataSource.isInitialized) {
      return null;
    }

    return this.repository().findOne({ where: { id } });
  }

  async create(dados: MaterialFormData): Promise<Material> {
    const material = this.repository().create(this.toEntityData(dados));

    return this.repository().save(material);
  }

  async update(id: number, dados: MaterialFormData): Promise<Material | null> {
    const material = await this.findOne(id);

    if (!material) {
      return null;
    }

    Object.assign(material, this.toEntityData(dados));

    return this.repository().save(material);
  }

  async remove(id: number): Promise<Material | null> {
    const material = await this.findOne(id);

    if (!material) {
      return null;
    }

    return this.repository().remove(material);
  }
}
