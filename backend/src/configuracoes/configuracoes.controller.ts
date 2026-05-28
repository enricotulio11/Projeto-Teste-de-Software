import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ConfiguracoesService } from './configuracoes.service.js';
import { AtualizarConfiguracoesDto } from './dto/atualizar-configuracoes.dto.js';
import { JwtAutenticacaoGuard } from '../autenticacao/guardas/jwt-autenticacao.guard.js';
import { PapeisGuard } from '../autenticacao/guardas/papeis.guard.js';
import { Papeis } from '../autenticacao/decoradores/papeis.decorator.js';

@Controller('configuracoes')
@UseGuards(JwtAutenticacaoGuard, PapeisGuard)
@Papeis('admin')
export class ConfiguracoesController {
  constructor(private readonly configuracoesService: ConfiguracoesService) {}

  @Get()
  buscarConfiguracoes() {
    return this.configuracoesService.buscarConfiguracoes();
  }

  @Patch()
  atualizar(@Body() dto: AtualizarConfiguracoesDto) {
    return this.configuracoesService.atualizar(dto);
  }
}
