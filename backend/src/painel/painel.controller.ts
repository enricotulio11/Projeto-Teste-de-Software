import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PainelService } from './painel.service.js';
import { JwtAutenticacaoGuard } from '../autenticacao/guardas/jwt-autenticacao.guard.js';
import { PapeisGuard } from '../autenticacao/guardas/papeis.guard.js';
import { Papeis } from '../autenticacao/decoradores/papeis.decorator.js';

@Controller('painel')
@UseGuards(JwtAutenticacaoGuard)
export class PainelController {
  constructor(private readonly painelService: PainelService) {}

  @Get('resumo')
  @UseGuards(PapeisGuard)
  @Papeis('admin', 'recepcionista')
  resumo() {
    return this.painelService.resumo();
  }

  @Get('agendamentos-hoje')
  @UseGuards(PapeisGuard)
  @Papeis('admin', 'recepcionista', 'medico')
  agendamentosHoje() {
    return this.painelService.agendamentosHoje();
  }

  @Get('proximos-agendamentos')
  @UseGuards(PapeisGuard)
  @Papeis('admin', 'recepcionista', 'medico')
  proximosAgendamentos(@Query('limite') limite?: string) {
    return this.painelService.proximosAgendamentos(limite ? parseInt(limite, 10) : 10);
  }
}
