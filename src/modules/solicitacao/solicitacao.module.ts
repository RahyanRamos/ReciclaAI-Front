import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { MaterialModule } from '../material/material.module';
import { SolicitacaoController } from './solicitacao.controller';
import { SolicitacaoService } from './solicitacao.service';

@Module({
  imports: [DatabaseModule, MaterialModule],
  controllers: [SolicitacaoController],
  providers: [SolicitacaoService],
})
export class SolicitacaoModule {}
