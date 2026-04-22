import { Controller, Get, Render } from '@nestjs/common';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @Render('usuario/inicial')
  async inicial(): Promise<object> {
    const resultado = await this.usuarioService.listar();

    return {
      titulo: 'Usuarios',
      usuarios: resultado.registros,
      bancoIndisponivel: resultado.bancoIndisponivel,
      tabelaInexistente: resultado.tabelaInexistente,
      nomeTabela: 'usuarios',
    };
  }
}
