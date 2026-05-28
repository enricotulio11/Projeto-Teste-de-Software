import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Usuario } from './usuarios/usuario.entity.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { AutenticacaoModule } from './autenticacao/autenticacao.module.js';
import { LogsModule } from './logs/logs.module.js';
import { ConfiguracoesModule } from './configuracoes/configuracoes.module.js';
import { Especialidade } from './especialidades/especialidade.entity.js';
import { EspecialidadesModule } from './especialidades/especialidades.module.js';
import { Localizacao } from './localizacoes/localizacao.entity.js';
import { LocalizacoesModule } from './localizacoes/localizacoes.module.js';
import { DependentesModule } from './dependentes/dependentes.module.js';
import { AgendamentosModule } from './agendamentos/agendamentos.module.js';
import { PainelModule } from './painel/painel.module.js';
import { DadosIniciaisService } from './seeds/dados-iniciais.service.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'medagenda.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Usuario, Especialidade, Localizacao]),
    UsuariosModule,
    AutenticacaoModule,
    LogsModule,
    ConfiguracoesModule,
    EspecialidadesModule,
    LocalizacoesModule,
    DependentesModule,
    AgendamentosModule,
    PainelModule,
  ],
  controllers: [AppController],
  providers: [AppService, DadosIniciaisService],
})
export class AppModule {}
