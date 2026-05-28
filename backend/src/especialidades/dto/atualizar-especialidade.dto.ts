import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AtualizarEspecialidadeDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nome?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
