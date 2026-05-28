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
import { EspecialidadesService } from './especialidades.service.js';
import { CriarEspecialidadeDto } from './dto/criar-especialidade.dto.js';
import { AtualizarEspecialidadeDto } from './dto/atualizar-especialidade.dto.js';
import { JwtAutenticacaoGuard } from '../autenticacao/guardas/jwt-autenticacao.guard.js';
import { PapeisGuard } from '../autenticacao/guardas/papeis.guard.js';
import { Papeis } from '../autenticacao/decoradores/papeis.decorator.js';

@Controller('especialidades')
@UseGuards(JwtAutenticacaoGuard)
export class EspecialidadesController {
  constructor(private readonly especialidadesService: EspecialidadesService) {}

  @Get()
  buscarAtivas() {
    return this.especialidadesService.buscarAtivas();
  }

  @Get('todas')
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  buscarTodas() {
    return this.especialidadesService.buscarTodas();
  }

  @Post()
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  criar(@Body() dto: CriarEspecialidadeDto) {
    return this.especialidadesService.criar(dto);
  }

  @Patch(':id')
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarEspecialidadeDto) {
    return this.especialidadesService.atualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  remover(@Param('id') id: string) {
    return this.especialidadesService.remover(id);
  }
}
