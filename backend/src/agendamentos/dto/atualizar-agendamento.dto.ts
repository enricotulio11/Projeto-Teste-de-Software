import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CriarAgendamentoDto } from './criar-agendamento.dto.js';

export class AtualizarAgendamentoDto extends PartialType(CriarAgendamentoDto) {
  @IsOptional()
  @IsIn(['agendado', 'confirmado', 'cancelado', 'concluido', 'falta'])
  status?: string;
}
