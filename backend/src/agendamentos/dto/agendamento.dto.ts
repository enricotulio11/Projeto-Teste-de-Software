import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreateAgendamentoDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data invalida.' })
  date: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Horario invalido.' })
  time: string;

  @IsUUID()
  patientId: string;

  @IsUUID()
  specialtyId: string;

  @IsUUID()
  locationId: string;
}

export class UpdateAgendamentoDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data invalida.' })
  date?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Horario invalido.' })
  time?: string;

  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsOptional()
  @IsUUID()
  specialtyId?: string;

  @IsOptional()
  @IsUUID()
  locationId?: string;
}
