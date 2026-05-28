import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendamento } from './agendamento.entity.js';
import { AgendamentosController } from './agendamentos.controller.js';
import { AgendamentosService } from './agendamentos.service.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { EspecialidadesModule } from '../especialidades/especialidades.module.js';
import { LocalizacoesModule } from '../localizacoes/localizacoes.module.js';
import { DependentesModule } from '../dependentes/dependentes.module.js';
import { LogsModule } from '../logs/logs.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agendamento]),
    UsuariosModule,
    EspecialidadesModule,
    LocalizacoesModule,
    DependentesModule,
    LogsModule,
  ],
  controllers: [AgendamentosController],
  providers: [AgendamentosService],
  exports: [AgendamentosService],
})
export class AgendamentosModule {}
