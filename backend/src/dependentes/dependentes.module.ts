import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dependente } from './dependente.entity.js';
import { DependentesController } from './dependentes.controller.js';
import { DependentesService } from './dependentes.service.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { ConfiguracoesModule } from '../configuracoes/configuracoes.module.js';
import { LogsModule } from '../logs/logs.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dependente]),
    UsuariosModule,
    ConfiguracoesModule,
    LogsModule,
  ],
  controllers: [DependentesController],
  providers: [DependentesService],
  exports: [DependentesService],
})
export class DependentesModule {}
