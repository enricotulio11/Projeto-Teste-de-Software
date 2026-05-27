import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 digitos.' })
  cpf: string;

  @IsString()
  @Matches(/^[A-Za-z0-9]{6}$/, {
    message: 'Senha deve conter 6 caracteres alfanumericos.',
  })
  password: string;

  @IsString()
  @Matches(/^\d{4}$/, { message: 'PIN deve conter 4 digitos.' })
  pin: string;
}
