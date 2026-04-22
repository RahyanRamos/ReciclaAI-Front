import { Controller, Get, Render } from '@nestjs/common';
import { SolicitacaoService } from './solicitacao.service';

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
}
