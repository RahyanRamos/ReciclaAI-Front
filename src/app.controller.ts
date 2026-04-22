import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

type ResumoRota = {
  rota: string;
  descricao: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('inicial')
  inicial(): object {
    const rotas: ResumoRota[] = [
      {
        rota: '/usuarios',
        descricao: 'Gestao de clientes, catadores e empresas',
      },
      {
        rota: '/materiais',
        descricao: 'Padrao de materiais reciclaveis aceitos',
      },
      {
        rota: '/solicitacoes',
        descricao: 'Solicitacoes de coleta abertas pelos clientes',
      },
      { rota: '/coletas', descricao: 'Registro de coletas executadas' },
      { rota: '/equipes', descricao: 'Equipes responsaveis pela logistica' },
      { rota: '/avaliacoes', descricao: 'Feedback sobre servicos prestados' },
    ];

    return {
      titulo: 'ReciclaAI - Painel Administrativo',
      subtitulo: 'Sistema base para gestao de coleta de materiais reciclaveis',
      horaAgora: new Date().toLocaleString('pt-BR'),
      resumoRotas: rotas,
    };
  }

  @Get('sobre')
  @Render('_sobre')
  sobre(): object {
    return {
      titulo: 'Sobre o projeto ReciclaAI',
      descricao:
        'Base academica para administrar usuarios, materiais, solicitacoes, coletas, equipes e avaliacoes.',
    };
  }

  @Get('login')
  @Render('autenticacao/login')
  login(): object {
    return { layout: false };
  }

  @Get('status')
  status() {
    return this.appService.getStatus();
  }
}
