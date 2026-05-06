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
import { PerfilUsuario, TipoPessoa } from './usuario.entity';
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

  @Get('criar')
  @Render('usuario/formulario')
  formularioCriar(): object {
    return {
      titulo: 'Novo usuario',
      subtitulo: 'Cadastre uma pessoa ou empresa no sistema',
      tiposPessoa: Object.values(TipoPessoa),
      perfisUsuario: Object.values(PerfilUsuario),
    };
  }

  @Post('criar')
  @Redirect('/usuarios')
  async formularioCriarSalvar(@Body() dados: object): Promise<void> {
    await this.usuarioService.create(dados);
  }

  @Get(':id/editar')
  @Render('usuario/formulario')
  async formularioEditar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const usuario = await this.usuarioService.findOne(id);

    if (!usuario) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return {
      titulo: 'Edicao de usuario',
      subtitulo: `Atualizacao do usuario: ${usuario.nome}`,
      usuario,
      tiposPessoa: Object.values(TipoPessoa),
      perfisUsuario: Object.values(PerfilUsuario),
    };
  }

  @Post(':id/editar')
  @Redirect('/usuarios')
  async formularioEditarSalvar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: object,
  ): Promise<void> {
    await this.usuarioService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('usuario/remover')
  async formularioExcluir(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    const usuario = await this.usuarioService.findOne(id);

    if (!usuario) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return {
      titulo: 'Exclusao de usuario',
      subtitulo: `Exclusao do usuario: ${usuario.nome}`,
      usuario,
    };
  }

  @Post(':id/excluir')
  @Redirect('/usuarios')
  async formularioExcluirSalvar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.usuarioService.remove(id);
  }

  @Post(':id/remover')
  @HttpCode(204)
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usuarioService.remove(id);
  }
}
