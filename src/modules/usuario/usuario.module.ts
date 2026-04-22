import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
