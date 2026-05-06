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
import { AvaliacaoService } from './avaliacao.service';

@Controller('avaliacoes')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Get()
  @Render('avaliacao/inicial')
  async inicial(): Promise<object> {
    const resultado = await this.avaliacaoService.listar();

    return {
      titulo: 'Avaliacoes de Coletas',
      avaliacoes: resultado.registros,
      bancoIndisponivel: resultado.bancoIndisponivel,
      tabelaInexistente: resultado.tabelaInexistente,
      nomeTabela: 'avaliacoes',
    };
  }

  @Get('criar')
  @Render('avaliacao/formulario')
  formularioCriar(): object {
    return {
      titulo: 'Nova avaliacao',
      subtitulo: 'Registre um feedback de atendimento',
    };
  }

  @Post('criar')
  @Redirect('/avaliacoes')
  async formularioCriarSalvar(@Body() dados: object): Promise<void> {
    await this.avaliacaoService.create(dados);
  }

  @Get(':id/editar')
  @Render('avaliacao/formulario')
  async formularioEditar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const avaliacao = await this.avaliacaoService.findOne(id);

    if (!avaliacao) {
      throw new NotFoundException('Avaliacao nao encontrada');
    }

    return {
      titulo: 'Edicao de avaliacao',
      subtitulo: `Atualizacao da avaliacao #${avaliacao.id}`,
      avaliacao,
    };
  }

  @Post(':id/editar')
  @Redirect('/avaliacoes')
  async formularioEditarSalvar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: object,
  ): Promise<void> {
    await this.avaliacaoService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('avaliacao/remover')
  async formularioExcluir(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const avaliacao = await this.avaliacaoService.findOne(id);

    if (!avaliacao) {
      throw new NotFoundException('Avaliacao nao encontrada');
    }

    return {
      titulo: 'Exclusao de avaliacao',
      subtitulo: `Exclusao da avaliacao #${avaliacao.id}`,
      avaliacao,
    };
  }

  @Post(':id/excluir')
  @Redirect('/avaliacoes')
  async formularioExcluirSalvar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.avaliacaoService.remove(id);
  }

  @Post(':id/remover')
  @HttpCode(204)
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.avaliacaoService.remove(id);
  }
}
