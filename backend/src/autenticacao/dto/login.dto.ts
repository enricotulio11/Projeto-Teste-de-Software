import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  cpf: string;

  @IsString()
  senha: string;
}
