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
import { ColetaService } from './coleta.service';
import { StatusColeta } from './coleta.entity';

@Controller('coletas')
export class ColetaController {
  constructor(private readonly coletaService: ColetaService) {}

  @Get()
  @Render('coleta/inicial')
  async inicial(): Promise<object> {
    const resultado = await this.coletaService.listar();

    return {
      titulo: 'Coletas Realizadas',
      coletas: resultado.registros,
      bancoIndisponivel: resultado.bancoIndisponivel,
      tabelaInexistente: resultado.tabelaInexistente,
      nomeTabela: 'coletas',
    };
  }

  @Get('criar')
  @Render('coleta/formulario')
  formularioCriar(): object {
    return {
      titulo: 'Nova coleta',
      subtitulo: 'Registre uma coleta realizada ou planejada',
      statusColeta: Object.values(StatusColeta),
    };
  }

  @Post('criar')
  @Redirect('/coletas')
  async formularioCriarSalvar(@Body() dados: object): Promise<void> {
    await this.coletaService.create(dados);
  }

  @Get(':id/editar')
  @Render('coleta/formulario')
  async formularioEditar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const coleta = await this.coletaService.findOne(id);

    if (!coleta) {
      throw new NotFoundException('Coleta nao encontrada');
    }

    return {
      titulo: 'Edicao de coleta',
      subtitulo: `Atualizacao da coleta: ${dateLabel(coleta.dataColeta)}`,
      coleta,
      statusColeta: Object.values(StatusColeta),
    };
  }

  @Post(':id/editar')
  @Redirect('/coletas')
  async formularioEditarSalvar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: object,
  ): Promise<void> {
    await this.coletaService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('coleta/remover')
  async formularioExcluir(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const coleta = await this.coletaService.findOne(id);

    if (!coleta) {
      throw new NotFoundException('Coleta nao encontrada');
    }

    return {
      titulo: 'Exclusao de coleta',
      subtitulo: `Exclusao da coleta: ${dateLabel(coleta.dataColeta)}`,
      coleta,
    };
  }

  @Post(':id/excluir')
  @Redirect('/coletas')
  async formularioExcluirSalvar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.coletaService.remove(id);
  }

  @Post(':id/remover')
  @HttpCode(204)
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.coletaService.remove(id);
  }
}

const dateLabel = (value: string): string => value;
