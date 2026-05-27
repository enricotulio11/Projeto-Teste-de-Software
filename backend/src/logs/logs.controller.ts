import { Controller, Get, Query } from '@nestjs/common';
import { LogsService } from './logs.service.js';
import { FiltrosLogDto } from './dto/filtros-log.dto.js';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  buscarTodos(@Query() filtros: FiltrosLogDto) {
    return this.logsService.buscarTodos({
      tipo: filtros.tipo,
      usuarioId: filtros.usuarioId,
      cpf: filtros.cpf,
      de: filtros.de,
      ate: filtros.ate,
      pagina: filtros.pagina ? Number(filtros.pagina) : undefined,
      limite: filtros.limite ? Number(filtros.limite) : undefined,
    });
  }

  @Get('estatisticas')
  buscarEstatisticas(@Query('dias') dias?: string) {
    return this.logsService.buscarEstatisticas(dias ? Number(dias) : undefined);
  }
}
