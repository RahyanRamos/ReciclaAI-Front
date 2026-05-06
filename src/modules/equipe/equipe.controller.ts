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
import { EquipeService } from './equipe.service';

@Controller('equipes')
export class EquipeController {
  constructor(private readonly equipeService: EquipeService) {}

  @Get()
  @Render('equipe/inicial')
  async inicial(): Promise<object> {
    const resultado = await this.equipeService.listar();

    return {
      titulo: 'Equipes de Coleta',
      equipes: resultado.registros,
      bancoIndisponivel: resultado.bancoIndisponivel,
      tabelaInexistente: resultado.tabelaInexistente,
      nomeTabela: 'equipes',
    };
  }

  @Get('criar')
  @Render('equipe/formulario')
  formularioCriar(): object {
    return {
      titulo: 'Nova equipe',
      subtitulo: 'Cadastre uma equipe responsavel por coletas',
    };
  }

  @Post('criar')
  @Redirect('/equipes')
  async formularioCriarSalvar(@Body() dados: object): Promise<void> {
    await this.equipeService.create(dados);
  }

  @Get(':id/editar')
  @Render('equipe/formulario')
  async formularioEditar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const equipe = await this.equipeService.findOne(id);

    if (!equipe) {
      throw new NotFoundException('Equipe nao encontrada');
    }

    return {
      titulo: 'Edicao de equipe',
      subtitulo: `Atualizacao da equipe: ${equipe.nome}`,
      equipe,
    };
  }

  @Post(':id/editar')
  @Redirect('/equipes')
  async formularioEditarSalvar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: object,
  ): Promise<void> {
    await this.equipeService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('equipe/remover')
  async formularioExcluir(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const equipe = await this.equipeService.findOne(id);

    if (!equipe) {
      throw new NotFoundException('Equipe nao encontrada');
    }

    return {
      titulo: 'Exclusao de equipe',
      subtitulo: `Exclusao da equipe: ${equipe.nome}`,
      equipe,
    };
  }

  @Post(':id/excluir')
  @Redirect('/equipes')
  async formularioExcluirSalvar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.equipeService.remove(id);
  }

  @Post(':id/remover')
  @HttpCode(204)
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.equipeService.remove(id);
  }
}
