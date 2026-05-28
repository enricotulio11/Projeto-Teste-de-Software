import { IsString, MaxLength, MinLength } from 'class-validator';

export class CriarEspecialidadeDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nome!: string;
}
