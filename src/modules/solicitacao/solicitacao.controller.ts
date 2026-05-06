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
import { SolicitacaoService } from './solicitacao.service';
import { StatusSolicitacao } from './solicitacao.entity';

@Controller('solicitacoes')
export class SolicitacaoController {
  constructor(private readonly solicitacaoService: SolicitacaoService) {}

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
  formularioCriar(): object {
    return {
      titulo: 'Nova solicitacao',
      subtitulo: 'Registre um pedido de coleta',
      statusSolicitacao: Object.values(StatusSolicitacao),
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

    return {
      titulo: 'Edicao de solicitacao',
      subtitulo: `Atualizacao da solicitacao: ${solicitacao.descricao}`,
      solicitacao,
      statusSolicitacao: Object.values(StatusSolicitacao),
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
