import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { AvaliacaoModule } from './modules/avaliacao/avaliacao.module';
import { ColetaModule } from './modules/coleta/coleta.module';
import { EquipeModule } from './modules/equipe/equipe.module';
import { MaterialModule } from './modules/material/material.module';
import { SolicitacaoModule } from './modules/solicitacao/solicitacao.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsuarioModule,
    MaterialModule,
    SolicitacaoModule,
    ColetaModule,
    EquipeModule,
    AvaliacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
