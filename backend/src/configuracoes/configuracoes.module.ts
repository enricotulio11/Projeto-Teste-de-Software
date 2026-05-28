import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracoesSistema } from './configuracoes-sistema.entity.js';
import { ConfiguracoesController } from './configuracoes.controller.js';
import { ConfiguracoesService } from './configuracoes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracoesSistema])],
  controllers: [ConfiguracoesController],
  providers: [ConfiguracoesService],
  exports: [ConfiguracoesService],
})
export class ConfiguracoesModule {}
