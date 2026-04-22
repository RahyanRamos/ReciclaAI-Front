import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
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

@Injectable()
export class EquipeService {
  constructor(
    @Inject(DATABASE_SOURCE) private readonly dataSource: DataSource,
  ) {}

  async listar(): Promise<ResultadoListaEquipes> {
    if (!this.dataSource.isInitialized) {
      return {
        registros: [],
        bancoIndisponivel: true,
        tabelaInexistente: false,
      };
    }

    try {
      const registros = await this.dataSource.getRepository(Equipe).find({
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
