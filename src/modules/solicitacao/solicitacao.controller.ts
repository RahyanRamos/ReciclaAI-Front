import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Redirect,
  Render,
} from '@nestjs/common';
import { MaterialService } from '../material/material.service';
import { SolicitacaoService } from './solicitacao.service';
import { StatusSolicitacao } from './solicitacao.entity';

@Controller('solicitacoes')
export class SolicitacaoController {
  constructor(
    private readonly solicitacaoService: SolicitacaoService,
    private readonly materialService: MaterialService,
  ) {}

  @Get()
  @Render('solicitacao/inicial')
  async inicial(): Promise<object> {
    const resultado = await this.solicitacaoService.listar();

    return {
      titulo: 'Solicitacoes de Coleta',
      solicitacoes: resultado.registros,
      bancoIndisponivel: resultado.bancoIndisponivel,
      tabelaInexistente: resultado.tabelaInexistente,
      nomeTabela: 'solicitacoes_coleta',
    };
  }

  @Get('criar')
  @Render('solicitacao/formulario')
  async formularioCriar(): Promise<object> {
    const materiais = await this.materialService.listar();

    return {
      titulo: 'Nova solicitacao',
      subtitulo: 'Registre um pedido de coleta',
      statusSolicitacao: Object.values(StatusSolicitacao),
      materiaisDisponiveis: materiais.registros.filter((item) => item.ativo),
    };
  }

  @Post('criar')
  @Redirect('/solicitacoes')
  async formularioCriarSalvar(@Body() dados: object): Promise<void> {
    await this.solicitacaoService.create(dados);
  }

  @Get(':id/editar')
  @Render('solicitacao/formulario')
  async formularioEditar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const solicitacao = await this.solicitacaoService.findOne(id);

    if (!solicitacao) {
      throw new NotFoundException('Solicitacao nao encontrada');
    }

    const materiais = await this.materialService.listar();

    return {
      titulo: 'Edicao de solicitacao',
      subtitulo: `Atualizacao da solicitacao: ${solicitacao.descricao}`,
      solicitacao,
      statusSolicitacao: Object.values(StatusSolicitacao),
      materiaisDisponiveis: materiais.registros.filter((item) => item.ativo),
    };
  }

  @Post(':id/editar')
  @Redirect('/solicitacoes')
  async formularioEditarSalvar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: object,
  ): Promise<void> {
    await this.solicitacaoService.update(id, dados);
  }

  @Get(':id/aceitar')
  @Render('solicitacao/aceitar')
  async formularioAceitar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const solicitacao = await this.solicitacaoService.findOne(id);

    if (!solicitacao) {
      throw new NotFoundException('Solicitacao nao encontrada');
    }

    return {
      titulo: 'Aceitar solicitacao',
      subtitulo: `Confirmar aceite da solicitacao: ${solicitacao.descricao}`,
      solicitacao,
      podeAceitar: solicitacao.status === StatusSolicitacao.ABERTA,
    };
  }

  @Post(':id/aceitar')
  @Redirect()
  async aceitarSalvar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ url: string }> {
    const coleta = await this.solicitacaoService.aceitar(id);

    return { url: `/coletas/${coleta.id}/editar` };
  }

  @Get(':id/excluir')
  @Render('solicitacao/remover')
  async formularioExcluir(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const solicitacao = await this.solicitacaoService.findOne(id);

    if (!solicitacao) {
      throw new NotFoundException('Solicitacao nao encontrada');
    }

    return {
      titulo: 'Exclusao de solicitacao',
      subtitulo: `Exclusao da solicitacao: ${solicitacao.descricao}`,
      solicitacao,
    };
  }

  @Post(':id/excluir')
  @Redirect('/solicitacoes')
  async formularioExcluirSalvar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.solicitacaoService.remove(id);
  }

  @Post(':id/remover')
  @HttpCode(204)
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.solicitacaoService.remove(id);
  }
}
