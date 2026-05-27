import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Especialidade } from '../entidades/especialidade.entity';
import { Localizacao } from '../entidades/localizacao.entity';
import {
  AdminCatalogosController,
  CatalogosController,
} from './catalogos.controller';
import { CatalogosService } from './catalogos.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Especialidade, Localizacao])],
  controllers: [CatalogosController, AdminCatalogosController],
  providers: [CatalogosService],
})
export class CatalogosModule {}
