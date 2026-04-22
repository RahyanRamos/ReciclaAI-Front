import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DATABASE_SOURCE } from '../../config/constants/database-source';
import { Solicitacao } from './solicitacao.entity';

type ResultadoListaSolicitacoes = {
  registros: Solicitacao[];
  bancoIndisponivel: boolean;
  tabelaInexistente: boolean;
};

type MysqlError = {
  code?: unknown;
};

@Injectable()
export class SolicitacaoService {
  constructor(
    @Inject(DATABASE_SOURCE) private readonly dataSource: DataSource,
  ) {}

  async listar(): Promise<ResultadoListaSolicitacoes> {
    if (!this.dataSource.isInitialized) {
      return {
        registros: [],
        bancoIndisponivel: true,
        tabelaInexistente: false,
      };
    }

    try {
      const registros = await this.dataSource.getRepository(Solicitacao).find({
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
}
