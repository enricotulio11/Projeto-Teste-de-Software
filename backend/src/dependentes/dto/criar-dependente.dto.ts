import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import type { Parentesco } from '../dependente.entity.js';

const PARENTESCOS: Parentesco[] = [
  'filho',
  'filha',
  'conjuge',
  'pai',
  'mae',
  'irmao',
  'irma',
  'outro',
];

export class CriarDependenteDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)
  cpf!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dataNascimento!: string;

  @IsIn(PARENTESCOS)
  parentesco!: Parentesco;

  @IsUUID()
  usuarioId!: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
