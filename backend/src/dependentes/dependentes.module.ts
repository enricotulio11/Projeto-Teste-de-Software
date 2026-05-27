import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Dependente } from '../entidades/dependente.entity';
import { Log } from '../entidades/log.entity';
import { DependentesController } from './dependentes.controller';
import { DependentesService } from './dependentes.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Dependente, Log])],
  controllers: [DependentesController],
  providers: [DependentesService],
})
export class DependentesModule {}
