import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class AtualizarConfiguracoesDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nomeSistema?: string;

  @IsOptional()
  @IsBoolean()
  modoManutencao?: boolean;

  @IsOptional()
  @IsBoolean()
  permitirCadastros?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  limiteDependentes?: number;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(120)
  tempoSessao?: number;

  @IsOptional()
  @IsBoolean()
  habilitarLogsSeguranca?: boolean;

  @IsOptional()
  @IsBoolean()
  exigirSenhaForte?: boolean;

  @IsOptional()
  @IsBoolean()
  habilitarNotificacoesEmail?: boolean;

  @IsOptional()
  @IsEmail()
  emailNotificacao?: string;
}
