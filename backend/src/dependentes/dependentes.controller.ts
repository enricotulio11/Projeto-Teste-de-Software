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
import { DependentesService } from './dependentes.service.js';
import { CriarDependenteDto } from './dto/criar-dependente.dto.js';
import { AtualizarDependenteDto } from './dto/atualizar-dependente.dto.js';
import { JwtAutenticacaoGuard } from '../autenticacao/guardas/jwt-autenticacao.guard.js';

@Controller('dependentes')
@UseGuards(JwtAutenticacaoGuard)
export class DependentesController {
  constructor(private readonly dependentesService: DependentesService) {}

  @Get()
  buscarTodos() {
    return this.dependentesService.buscarTodos();
  }

  @Get('usuario/:usuarioId')
  buscarPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.dependentesService.buscarPorUsuario(usuarioId);
  }

  @Get(':id')
  buscarUm(@Param('id') id: string) {
    return this.dependentesService.buscarUm(id);
  }

  @Post()
  criar(@Body() dto: CriarDependenteDto) {
    return this.dependentesService.criar(dto);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarDependenteDto) {
    return this.dependentesService.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.dependentesService.remover(id);
  }
}
