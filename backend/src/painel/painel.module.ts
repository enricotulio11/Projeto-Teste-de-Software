import { Module } from '@nestjs/common';
import { PainelService } from './painel.service.js';
import { PainelController } from './painel.controller.js';
import { AgendamentosModule } from '../agendamentos/agendamentos.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';

@Module({
  imports: [AgendamentosModule, UsuariosModule],
  controllers: [PainelController],
  providers: [PainelService],
})
export class PainelModule {}
