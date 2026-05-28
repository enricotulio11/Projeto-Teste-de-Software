import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CriarUsuarioDto } from './dto/criar-usuario.dto.js';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto.js';
import { JwtAutenticacaoGuard } from '../autenticacao/guardas/jwt-autenticacao.guard.js';
import { PapeisGuard } from '../autenticacao/guardas/papeis.guard.js';
import { Papeis } from '../autenticacao/decoradores/papeis.decorator.js';

@Controller('usuarios')
@UseGuards(JwtAutenticacaoGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  criar(@Body() dto: CriarUsuarioDto) {
    return this.usuariosService.criar(dto);
  }

  @Get()
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  buscarTodos() {
    return this.usuariosService.buscarTodos();
  }

  @Get('medicos')
  buscarMedicos() {
    return this.usuariosService.buscarMedicos();
  }

  @Get(':id')
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  buscarUm(@Param('id') id: string) {
    return this.usuariosService.buscarUm(id);
  }

  @Patch(':id')
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarUsuarioDto) {
    return this.usuariosService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PapeisGuard)
  @Papeis('admin')
  remover(@Param('id') id: string) {
    return this.usuariosService.remover(id);
  }
}
