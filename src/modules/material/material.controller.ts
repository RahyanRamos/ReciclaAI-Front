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
import { MaterialService } from './material.service';

@Controller('materiais')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  @Render('material/inicial')
  async inicial(): Promise<object> {
    const resultado = await this.materialService.listar();

    return {
      titulo: 'Materiais Reciclaveis',
      materiais: resultado.registros,
      bancoIndisponivel: resultado.bancoIndisponivel,
      tabelaInexistente: resultado.tabelaInexistente,
      nomeTabela: 'materiais',
    };
  }

  @Get('criar')
  @Render('material/formulario')
  formularioCriar(): object {
    return {
      titulo: 'Novo material',
      subtitulo: 'Cadastre um material aceito pela coleta',
    };
  }

  @Post('criar')
  @Redirect('/materiais')
  async formularioCriarSalvar(@Body() dados: object): Promise<void> {
    await this.materialService.create(dados);
  }

  @Get(':id/editar')
  @Render('material/formulario')
  async formularioEditar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const material = await this.materialService.findOne(id);

    if (!material) {
      throw new NotFoundException('Material nao encontrado');
    }

    return {
      titulo: 'Edicao de material',
      subtitulo: `Atualizacao do material: ${material.nome}`,
      material,
    };
  }

  @Post(':id/editar')
  @Redirect('/materiais')
  async formularioEditarSalvar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: object,
  ): Promise<void> {
    await this.materialService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('material/remover')
  async formularioExcluir(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const material = await this.materialService.findOne(id);

    if (!material) {
      throw new NotFoundException('Material nao encontrado');
    }

    return {
      titulo: 'Exclusao de material',
      subtitulo: `Exclusao do material: ${material.nome}`,
      material,
    };
  }

  @Post(':id/excluir')
  @Redirect('/materiais')
  async formularioExcluirSalvar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.materialService.remove(id);
  }

  @Post(':id/remover')
  @HttpCode(204)
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.materialService.remove(id);
  }
}
