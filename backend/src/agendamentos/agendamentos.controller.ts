import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service.js';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto.js';
import { AtualizarAgendamentoDto } from './dto/atualizar-agendamento.dto.js';
import { JwtAutenticacaoGuard } from '../autenticacao/guardas/jwt-autenticacao.guard.js';
import { PapeisGuard } from '../autenticacao/guardas/papeis.guard.js';
import { Papeis } from '../autenticacao/decoradores/papeis.decorator.js';

@Controller('agendamentos')
@UseGuards(JwtAutenticacaoGuard)
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Get()
  @UseGuards(PapeisGuard)
  @Papeis('admin', 'recepcionista')
  buscarTodos() {
    return this.agendamentosService.buscarTodos();
  }

  @Get('paciente/:pacienteId')
  buscarPorPaciente(@Param('pacienteId') pacienteId: string) {
    return this.agendamentosService.buscarPorPaciente(pacienteId);
  }

  @Get('medico/:medicoId')
  buscarPorMedico(@Param('medicoId') medicoId: string) {
    return this.agendamentosService.buscarPorMedico(medicoId);
  }

  @Get(':id')
  buscarUm(@Param('id') id: string) {
    return this.agendamentosService.buscarUm(id);
  }

  @Post()
  criar(@Body() dto: CriarAgendamentoDto) {
    return this.agendamentosService.criar(dto);
  }

  @Patch(':id')
  @UseGuards(PapeisGuard)
  @Papeis('admin', 'recepcionista', 'medico')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarAgendamentoDto) {
    return this.agendamentosService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  remover(@Param('id') id: string) {
    return this.agendamentosService.remover(id);
  }
}
