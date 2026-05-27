import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CriarUsuarioDto {
  @IsString()
  nome: string;

  @IsString()
  cpf: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsOptional()
  @IsIn(['admin', 'medico', 'paciente', 'recepcionista'])
  papel?: string;
}
