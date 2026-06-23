import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATABASE_SOURCE } from '../../config/constants/database-source';
import { ColetaMaterial } from '../coleta/coleta-material.entity';
import { Coleta, StatusColeta } from '../coleta/coleta.entity';
import { SolicitacaoMaterial } from './solicitacao-material.entity';
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
  status?: StatusSolicitacao;
  materialId?: string | string[];
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

const RELATIONS = ['materiais', 'materiais.material'];

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
      status: dados.status ?? StatusSolicitacao.ABERTA,
    };
  }

  private parseMateriais(dados: SolicitacaoFormData): SolicitacaoMaterial[] {
    const materialIds = toArray(dados.materialId);
    const quantidades = toArray(dados.quantidadeEstimada);

    return materialIds
      .map((materialId, index) => ({
        material: { id: Number(materialId) },
        quantidadeEstimada: toDecimal(quantidades[index]),
      }))
      .filter((item) => item.material.id && item.quantidadeEstimada > 0)
      .map((item) =>
        this.dataSource.getRepository(SolicitacaoMaterial).create(item),
      );
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

  async findOne(id: number): Promise<Solicitacao | null> {
    if (!this.dataSource.isInitialized) {
      return null;
    }

    return this.repository().findOne({ where: { id }, relations: RELATIONS });
  }

  async create(dados: SolicitacaoFormData): Promise<Solicitacao> {
    const solicitacao = this.repository().create({
      ...this.toEntityData(dados),
      materiais: this.parseMateriais(dados),
    });

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

    await this.dataSource
      .getRepository(SolicitacaoMaterial)
      .delete({ solicitacao: { id } });

    Object.assign(solicitacao, this.toEntityData(dados));
    solicitacao.materiais = this.parseMateriais(dados);

    return this.repository().save(solicitacao);
  }

  async remove(id: number): Promise<Solicitacao | null> {
    const solicitacao = await this.findOne(id);

    if (!solicitacao) {
      return null;
    }

    return this.repository().remove(solicitacao);
  }

  async aceitar(id: number): Promise<Coleta> {
    const solicitacao = await this.findOne(id);

    if (!solicitacao) {
      throw new NotFoundException('Solicitacao nao encontrada');
    }

    if (solicitacao.status !== StatusSolicitacao.ABERTA) {
      throw new BadRequestException('Solicitacao nao pode mais ser aceita');
    }

    const coletaRepository = this.dataSource.getRepository(Coleta);

    const coleta = coletaRepository.create({
      dataColeta: new Date().toISOString().slice(0, 10),
      status: StatusColeta.PENDENTE,
      solicitacao,
      materiais: solicitacao.materiais.map((item) =>
        this.dataSource.getRepository(ColetaMaterial).create({
          material: item.material,
          quantidadeEstimada: item.quantidadeEstimada,
        }),
      ),
    });

    const coletaSalva = await coletaRepository.save(coleta);

    solicitacao.status = StatusSolicitacao.AGENDADA;
    await this.repository().save(solicitacao);

    return coletaSalva;
  }
}
