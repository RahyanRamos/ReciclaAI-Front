import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { ColetaController } from './coleta.controller';
import { ColetaService } from './coleta.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ColetaController],
  providers: [ColetaService],
})
export class ColetaModule {}
