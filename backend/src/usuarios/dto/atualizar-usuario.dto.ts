import { IsBoolean, IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class AtualizarUsuarioDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(['admin', 'medico', 'paciente', 'recepcionista'])
  papel?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsBoolean()
  bloqueado?: boolean;
}
