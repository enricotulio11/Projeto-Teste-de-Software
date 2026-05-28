import { PartialType } from '@nestjs/mapped-types';
import { CriarDependenteDto } from './criar-dependente.dto.js';

export class AtualizarDependenteDto extends PartialType(CriarDependenteDto) {}
