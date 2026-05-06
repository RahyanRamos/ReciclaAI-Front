import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATABASE_SOURCE } from '../../config/constants/database-source';
import { Solicitacao, StatusSolicitacao } from './solicitacao.entity';

type ResultadoListaSolicitacoes = {
  registros: Solicitacao[];
  bancoIndisponivel: boolean;
  tabelaInexistente: boolean;
};

type MysqlError = {
  code?: unknown;
};

type SolicitacaoFormData = {
  descricao?: string;
  localizacao?: string;
  volumeEstimado?: string | number;
  status?: StatusSolicitacao;
};

const toDecimal = (value: string | number | undefined): number => {
  if (typeof value === 'number') {
    return value;
  }

  return Number(String(value ?? '0').replace(',', '.')) || 0;
};

@Injectable()
export class SolicitacaoService {
  constructor(
    @Inject(DATABASE_SOURCE) private readonly dataSource: DataSource,
  ) {}

  private repository(): Repository<Solicitacao> {
    return this.dataSource.getRepository(Solicitacao);
  }

  private toEntityData(dados: SolicitacaoFormData): Partial<Solicitacao> {
    return {
      descricao: dados.descricao?.trim() ?? '',
      localizacao: dados.localizacao?.trim() ?? '',
      volumeEstimado: toDecimal(dados.volumeEstimado),
      status: dados.status ?? StatusSolicitacao.ABERTA,
    };
  }

  async listar(): Promise<ResultadoListaSolicitacoes> {
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

  async findOne(id: number): Promise<Solicitacao | null> {
    if (!this.dataSource.isInitialized) {
      return null;
    }

    return this.repository().findOne({ where: { id } });
  }

  async create(dados: SolicitacaoFormData): Promise<Solicitacao> {
    const solicitacao = this.repository().create(this.toEntityData(dados));

    return this.repository().save(solicitacao);
  }

  async update(
    id: number,
    dados: SolicitacaoFormData,
  ): Promise<Solicitacao | null> {
    const solicitacao = await this.findOne(id);

    if (!solicitacao) {
      return null;
    }

    Object.assign(solicitacao, this.toEntityData(dados));

    return this.repository().save(solicitacao);
  }

  async remove(id: number): Promise<Solicitacao | null> {
    const solicitacao = await this.findOne(id);

    if (!solicitacao) {
      return null;
    }

    return this.repository().remove(solicitacao);
  }
}
