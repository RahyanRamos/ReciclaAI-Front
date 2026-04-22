import { Controller, Get, Render } from '@nestjs/common';
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
}
