import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { EquipeController } from './equipe.controller';
import { EquipeService } from './equipe.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EquipeController],
  providers: [EquipeService],
})
export class EquipeModule {}
