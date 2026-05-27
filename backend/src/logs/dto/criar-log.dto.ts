import { IsIn, IsOptional, IsString } from 'class-validator';
import type { AcaoLog } from '../log.entity.js';

const ACOES: AcaoLog[] = [
  'login',
  'logout',
  'cadastro',
  'atualizacao',
  'remocao',
  'bloqueio',
  'acesso_negado',
];

export class CriarLogDto {
  @IsString()
  usuarioId!: string;

  @IsIn(ACOES)
  acao!: AcaoLog;

  @IsOptional()
  @IsString()
  detalhes?: string;

  @IsOptional()
  @IsString()
  ip?: string;
}
