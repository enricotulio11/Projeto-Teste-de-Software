import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Agendamento } from '../entidades/agendamento.entity';
import { Dependente } from '../entidades/dependente.entity';
import { Especialidade } from '../entidades/especialidade.entity';
import { Localizacao } from '../entidades/localizacao.entity';
import { Log } from '../entidades/log.entity';
import { Usuario } from '../entidades/usuario.entity';
import { AgendamentosController } from './agendamentos.controller';
import { AgendamentosService } from './agendamentos.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Agendamento,
      Usuario,
      Dependente,
      Especialidade,
      Localizacao,
      Log,
    ]),
  ],
  controllers: [AgendamentosController],
  providers: [AgendamentosService],
})
export class AgendamentosModule {}
