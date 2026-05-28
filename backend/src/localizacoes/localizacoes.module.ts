import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localizacao } from './localizacao.entity.js';
import { LocalizacoesController } from './localizacoes.controller.js';
import { LocalizacoesService } from './localizacoes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Localizacao])],
  controllers: [LocalizacoesController],
  providers: [LocalizacoesService],
  exports: [LocalizacoesService],
})
export class LocalizacoesModule {}
