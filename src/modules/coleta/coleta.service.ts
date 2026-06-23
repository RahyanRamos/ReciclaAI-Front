import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATABASE_SOURCE } from '../../config/constants/database-source';
import { Coleta, StatusColeta } from './coleta.entity';

type ResultadoListaColetas = {
  registros: Coleta[];
  bancoIndisponivel: boolean;
  tabelaInexistente: boolean;
};

type MysqlError = {
  code?: unknown;
};

type ColetaFormData = {
  dataColeta?: string;
  status?: StatusColeta;
  observacao?: string;
  coletaMaterialId?: string | string[];
  quantidadeEstimada?: string | string[];
};

const toDecimal = (value: string | number | undefined): number => {
  if (typeof value === 'number') {
    return value;
  }

  return Number(String(value ?? '0').replace(',', '.')) || 0;
};

const toArray = (value: string | string[] | undefined): string[] => {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const RELATIONS = ['materiais', 'materiais.material', 'solicitacao'];

@Injectable()
export class ColetaService {
  constructor(
    @Inject(DATABASE_SOURCE) private readonly dataSource: DataSource,
  ) {}

  private repository(): Repository<Coleta> {
    return this.dataSource.getRepository(Coleta);
  }

  private toEntityData(dados: ColetaFormData): Partial<Coleta> {
    return {
      dataColeta: dados.dataColeta ?? new Date().toISOString().slice(0, 10),
      status: dados.status ?? StatusColeta.PENDENTE,
      observacao: dados.observacao?.trim() || undefined,
    };
  }

  async listar(): Promise<ResultadoListaColetas> {
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
        relations: RELATIONS,
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

  async findOne(id: number): Promise<Coleta | null> {
    if (!this.dataSource.isInitialized) {
      return null;
    }

    return this.repository().findOne({ where: { id }, relations: RELATIONS });
  }

  async update(id: number, dados: ColetaFormData): Promise<Coleta | null> {
    const coleta = await this.findOne(id);

    if (!coleta) {
      return null;
    }

    Object.assign(coleta, this.toEntityData(dados));

    const ids = toArray(dados.coletaMaterialId);
    const quantidades = toArray(dados.quantidadeEstimada);
    const novasQuantidades = new Map(
      ids.map((itemId, index) => [Number(itemId), toDecimal(quantidades[index])]),
    );

    coleta.materiais.forEach((item) => {
      const novaQuantidade = novasQuantidades.get(item.id);

      if (novaQuantidade !== undefined) {
        item.quantidadeEstimada = novaQuantidade;
      }
    });

    return this.repository().save(coleta);
  }

  async remove(id: number): Promise<Coleta | null> {
    const coleta = await this.findOne(id);

    if (!coleta) {
      return null;
    }

    return this.repository().remove(coleta);
  }
}
