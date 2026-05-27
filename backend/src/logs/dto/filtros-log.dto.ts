import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';
import type { TipoLog } from '../log.entity.js';

const TIPOS_LOG: TipoLog[] = [
  'login',
  'logout',
  'login_falhou',
  'senha_redefinida',
  'pin_redefinido',
  'usuario_bloqueado',
  'usuario_desbloqueado',
  'usuario_criado',
  'agendamento_criado',
  'agendamento_atualizado',
  'agendamento_cancelado',
  'dependente_criado',
  'dependente_removido',
];

export class FiltrosLogDto {
  @IsOptional()
  @IsIn(TIPOS_LOG)
  tipo?: TipoLog;

  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  de?: string;

  @IsOptional()
  @IsString()
  ate?: string;

  @IsOptional()
  @IsNumberString()
  pagina?: string;

  @IsOptional()
  @IsNumberString()
  limite?: string;
}
