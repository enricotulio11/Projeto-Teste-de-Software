import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CriarAgendamentoDto {
  @IsUUID()
  pacienteId!: string;

  @IsUUID()
  medicoId!: string;

  @IsOptional()
  @IsUUID()
  dependenteId?: string;

  @IsUUID()
  especialidadeId!: string;

  @IsUUID()
  localizacaoId!: string;

  @IsDateString()
  dataHora!: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  duracao?: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
