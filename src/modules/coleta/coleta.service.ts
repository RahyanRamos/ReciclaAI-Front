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
  pesoTotal?: string | number;
  status?: StatusColeta;
  observacao?: string;
};

const toDecimal = (value: string | number | undefined): number => {
  if (typeof value === 'number') {
    return value;
  }

  return Number(String(value ?? '0').replace(',', '.')) || 0;
};

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
      pesoTotal: toDecimal(dados.pesoTotal),
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

    return this.repository().findOne({ where: { id } });
  }

  async create(dados: ColetaFormData): Promise<Coleta> {
    const coleta = this.repository().create(this.toEntityData(dados));

    return this.repository().save(coleta);
  }

  async update(id: number, dados: ColetaFormData): Promise<Coleta | null> {
    const coleta = await this.findOne(id);

    if (!coleta) {
      return null;
    }

    Object.assign(coleta, this.toEntityData(dados));

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
