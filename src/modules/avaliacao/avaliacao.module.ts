import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { AvaliacaoController } from './avaliacao.controller';
import { AvaliacaoService } from './avaliacao.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService],
})
export class AvaliacaoModule {}
