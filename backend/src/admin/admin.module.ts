import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Agendamento } from '../entidades/agendamento.entity';
import { ConfiguracoesSistema } from '../entidades/configuracoes-sistema.entity';
import { Dependente } from '../entidades/dependente.entity';
import { Log } from '../entidades/log.entity';
import { Usuario } from '../entidades/usuario.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Usuario,
      Dependente,
      Agendamento,
      Log,
      ConfiguracoesSistema,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
