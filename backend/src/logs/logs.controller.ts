import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service.js';
import { JwtAutenticacaoGuard } from '../autenticacao/guardas/jwt-autenticacao.guard.js';

@Controller('logs')
@UseGuards(JwtAutenticacaoGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  buscarTodos() {
    return this.logsService.buscarTodos();
  }

  @Get('usuario/:usuarioId')
  buscarPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.logsService.buscarPorUsuario(usuarioId);
  }

  @Get(':id')
  buscarUm(@Param('id') id: string) {
    return this.logsService.buscarUm(id);
  }
}
