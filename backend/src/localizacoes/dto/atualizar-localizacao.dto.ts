import { PartialType } from '@nestjs/mapped-types';
import { CriarLocalizacaoDto } from './criar-localizacao.dto.js';

export class AtualizarLocalizacaoDto extends PartialType(CriarLocalizacaoDto) {}
