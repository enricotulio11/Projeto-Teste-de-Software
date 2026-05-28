import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalizacoesService } from './localizacoes.service.js';
import { CriarLocalizacaoDto } from './dto/criar-localizacao.dto.js';
import { AtualizarLocalizacaoDto } from './dto/atualizar-localizacao.dto.js';
import { JwtAutenticacaoGuard } from '../autenticacao/guardas/jwt-autenticacao.guard.js';
import { PapeisGuard } from '../autenticacao/guardas/papeis.guard.js';
import { Papeis } from '../autenticacao/decoradores/papeis.decorator.js';

@Controller('localizacoes')
@UseGuards(JwtAutenticacaoGuard)
export class LocalizacoesController {
  constructor(private readonly localizacoesService: LocalizacoesService) {}

  @Get()
  buscarAtivas() {
    return this.localizacoesService.buscarAtivas();
  }

  @Get('todas')
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  buscarTodas() {
    return this.localizacoesService.buscarTodos();
  }

  @Get(':id')
  buscarUm(@Param('id') id: string) {
    return this.localizacoesService.buscarUm(id);
  }

  @Post()
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  criar(@Body() dto: CriarLocalizacaoDto) {
    return this.localizacoesService.criar(dto);
  }

  @Patch(':id')
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarLocalizacaoDto) {
    return this.localizacoesService.atualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  remover(@Param('id') id: string) {
    return this.localizacoesService.remover(id);
  }
}
