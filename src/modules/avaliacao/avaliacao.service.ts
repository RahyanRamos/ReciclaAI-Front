import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATABASE_SOURCE } from '../../config/constants/database-source';
import { Avaliacao } from './avaliacao.entity';

type ResultadoListaAvaliacoes = {
  registros: Avaliacao[];
  bancoIndisponivel: boolean;
  tabelaInexistente: boolean;
};

type MysqlError = {
  code?: unknown;
};

type AvaliacaoFormData = {
  nota?: string | number;
  comentario?: string;
  dataAvaliacao?: string;
};

const toNota = (value: string | number | undefined): number => {
  const nota = Number(value ?? 0);

  return Math.min(Math.max(nota, 1), 5);
};

@Injectable()
export class AvaliacaoService {
  constructor(
    @Inject(DATABASE_SOURCE) private readonly dataSource: DataSource,
  ) {}

  private repository(): Repository<Avaliacao> {
    return this.dataSource.getRepository(Avaliacao);
  }

  private toEntityData(dados: AvaliacaoFormData): Partial<Avaliacao> {
    return {
      nota: toNota(dados.nota),
      comentario: dados.comentario?.trim() || undefined,
      dataAvaliacao:
        dados.dataAvaliacao ?? new Date().toISOString().slice(0, 10),
    };
  }

  async listar(): Promise<ResultadoListaAvaliacoes> {
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

  async findOne(id: number): Promise<Avaliacao | null> {
    if (!this.dataSource.isInitialized) {
      return null;
    }

    return this.repository().findOne({ where: { id } });
  }

  async create(dados: AvaliacaoFormData): Promise<Avaliacao> {
    const avaliacao = this.repository().create(this.toEntityData(dados));

    return this.repository().save(avaliacao);
  }

  async update(
    id: number,
    dados: AvaliacaoFormData,
  ): Promise<Avaliacao | null> {
    const avaliacao = await this.findOne(id);

    if (!avaliacao) {
      return null;
    }

    Object.assign(avaliacao, this.toEntityData(dados));

    return this.repository().save(avaliacao);
  }

  async remove(id: number): Promise<Avaliacao | null> {
    const avaliacao = await this.findOne(id);

    if (!avaliacao) {
      return null;
    }

    return this.repository().remove(avaliacao);
  }
}
