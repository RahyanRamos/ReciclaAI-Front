import { Controller, Get, Render } from '@nestjs/common';
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
}
