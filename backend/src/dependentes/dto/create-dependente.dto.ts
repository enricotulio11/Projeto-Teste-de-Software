import { IsString, Matches } from 'class-validator';

export class CreateDependenteDto {
  @IsString()
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, { message: 'Nome invalido.' })
  name: string;

  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 digitos.' })
  cpf: string;
}
