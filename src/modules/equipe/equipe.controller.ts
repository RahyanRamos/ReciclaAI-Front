import { Controller, Get, Render } from '@nestjs/common';
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
}
