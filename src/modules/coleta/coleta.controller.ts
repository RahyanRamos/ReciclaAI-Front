import { Controller, Get, Render } from '@nestjs/common';
import { ColetaService } from './coleta.service';

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
}
